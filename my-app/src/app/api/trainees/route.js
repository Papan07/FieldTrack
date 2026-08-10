import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Trainee from "@/lib/models/Trainee";

export async function GET() {
  try {
    await dbConnect();
    const trainees = await Trainee.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(
      trainees.map((t) => ({ ...t, id: t._id.toString(), _id: undefined }))
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, batch, traineeId, role } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const trainee = await Trainee.create({ name, batch, traineeId, role });
    const obj = trainee.toObject();
    return NextResponse.json({ ...obj, id: obj._id.toString(), _id: undefined }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
