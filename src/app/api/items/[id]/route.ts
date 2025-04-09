// app/api/items/[id]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/app/_lib/dbConnect";
import Item from "@/app/_models/items";

export async function PUT(_: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = await params;
  const updated = await Item.findByIdAndUpdate(
    id,
    { $set: { date: new Date(Date.now() + 86400000) } },
    { new: true }
  );
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  await dbConnect();
  await Item.findByIdAndDelete(id);
  return new NextResponse(null, { status: 204 });
}