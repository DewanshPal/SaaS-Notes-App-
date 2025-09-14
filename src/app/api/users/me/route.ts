import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/user.model";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    // Get token from cookies
     const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Verify JWT
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    } catch {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    // Extract user id
    const userId = decoded.id;
    if (!userId) {
      return NextResponse.json({ success: false, message: "Invalid token payload" }, { status: 400 });
    }

    // Fetch user from DB
    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to fetch user" }, { status: 500 });
  }
}
