import { NextResponse , NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/user.model";
import { requireAdmin } from "@/lib/auth";

await dbConnect();


export async function PATCH(request: NextRequest){
  // Extract userId from query parameters
  const adminUser = await requireAdmin(request);
    if (!adminUser || 'status' in adminUser) {
      return adminUser || NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

  try {

    const { flag, value } = await request.json();

    if (!["isAddingMembers", "isUpgradingPlan"].includes(flag)) {
      return NextResponse.json({ error: "Invalid flag" }, { status: 400 });
    }

    const user = await UserModel.findByIdAndUpdate(
      adminUser.id,
      { [flag]: value },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Flag updated", user });
  } catch (error) {
    console.error("Error updating flag:", error);
    return NextResponse.json({ success: false, message: "Failed to update flag" }, { status: 500 });
  }
}
