import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { slug } = await req.json();
  return NextResponse.json({ success: true, message: "Slug received", slug });
}
