import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Site from "@/lib/models/Site";

export async function GET() {
  try {
    await dbConnect();
    const sites = await Site.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(
      sites.map((s) => ({ ...s, id: s._id.toString(), _id: undefined }))
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, description, latitude, longitude, radiusMeters } = body;

    if (!name || latitude == null || longitude == null || !radiusMeters) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const site = await Site.create({ name, description, latitude, longitude, radiusMeters });
    const obj = site.toObject();
    return NextResponse.json({ ...obj, id: obj._id.toString(), _id: undefined }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
