import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Site from "@/lib/models/Site";

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const deleted = await Site.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
