import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import UserModel from "@/model/user.model";
import dbConnect from "@/lib/dbConnection";


export async function authUser(req: NextRequest) {
  try {
    await dbConnect();
    
    const token = req.cookies.get("token")?.value || null;


    if (!token) return null;

    // 2. Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "") as { id: string };

    if (!decoded?.id) return null;

    // 3. Fetch user from DB
    const user = await UserModel.findById(decoded.id);
    return user || null;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

//Require Admin role
export async function requireAdmin(req: NextRequest) {
  const user = await authUser(req);

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return user;
}

//Require Member role
export async function requireMember(req: NextRequest) {
  const user = await authUser(req);

  if (!user || user.role !== "MEMBER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return user;
}
