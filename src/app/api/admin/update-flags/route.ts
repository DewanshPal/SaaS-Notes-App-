import { NextResponse , NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/user.model";
import jwt from "jsonwebtoken";

export async function PATCH(request: NextRequest){
  await dbConnect();

  try {
    // token in cookies
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    
    // verify token and get userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "") as { id: string };
    const userId = decoded?.id;

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { flag, value } = await request.json();

    if (!["isAddingMembers", "isUpgradingPlan"].includes(flag)) {
      return NextResponse.json({ error: "Invalid flag" }, { status: 400 });
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { [flag]: value },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Flag updated", user });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update flag" }, { status: 500 });
  }
}
