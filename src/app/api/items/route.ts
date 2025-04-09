// app/api/items/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/app/_lib/dbConnect";
import Item from "@/app/_models/items";

export async function GET() {
  await dbConnect();
  const items = await Item.find();
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  await dbConnect();
  const { text } = await req.json();
  const item = await Item.create({ text, date: new Date() });
  return NextResponse.json(item, { status: 201 });
}
