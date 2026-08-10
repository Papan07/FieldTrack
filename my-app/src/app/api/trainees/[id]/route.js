import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Trainee from "@/lib/models/Trainee";

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const deleted = await Trainee.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Trainee not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
