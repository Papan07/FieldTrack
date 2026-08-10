import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Attendance from "@/lib/models/Attendance";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("siteId");
    const status = searchParams.get("status");
    const date = searchParams.get("date"); // YYYY-MM-DD

    const filter = {};
    if (siteId && siteId !== "all") filter.siteId = siteId;
    if (status && status !== "all") filter.status = status;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.createdAt = { $gte: start, $lt: end };
    }

    const records = await Attendance.find(filter)
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();

    return NextResponse.json(
      records.map((r) => ({
        ...r,
        id: r._id.toString(),
        _id: undefined,
        timestamp: r.createdAt,
      }))
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const {
      traineeId, traineeName, traineeBatch,
      siteId, siteName,
      latitude, longitude, accuracy,
      distanceMeters, status,
    } = body;

    if (!traineeId || !siteId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const record = await Attendance.create({
      traineeId, traineeName, traineeBatch,
      siteId, siteName,
      latitude, longitude, accuracy,
      distanceMeters, status,
    });

    const obj = record.toObject();
    const result = { ...obj, id: obj._id.toString(), _id: undefined, timestamp: obj.createdAt };

    // Broadcast to SSE clients
    broadcastAttendance(result);

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ─── SSE broadcast registry ────────────────────────────────────────────────
// Kept in module scope so the stream route and this route share the same set.
export const sseClients = new Set();

export function broadcastAttendance(record) {
  const data = `data: ${JSON.stringify(record)}\n\n`;
  for (const controller of sseClients) {
    try {
      controller.enqueue(new TextEncoder().encode(data));
    } catch {
      sseClients.delete(controller);
    }
  }
}
