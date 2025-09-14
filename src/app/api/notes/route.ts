import dbConnect from "@/lib/dbConnection";
import NoteModel from "@/model/notes.model";
import TenantModel from "@/model/tenant.model";
import { requireMember } from "@/lib/auth";
import { requireAdmin } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

await dbConnect();

export async function POST(req: NextRequest) {
    const user = await requireMember(req);
    if (!user || 'status' in user)
    {
        return user || NextResponse.json({success: false,message: "Unauthorized" }, { status: 401 });
    }

  // Find tenant
  const tenant = await TenantModel.findById(user.tenantId);
  if (!tenant) {
    return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
  }

  // Check note limit
  if (tenant.noteLimit !== null) {
    const count = await NoteModel.countDocuments({ tenantId: tenant._id });
    if (count >= tenant.noteLimit) {
      return NextResponse.json({ success: false, message: "Note limit reached" }, { status: 403 });
    }
  }

    try {
        const { title, content } = await req.json();

        const newNote = new NoteModel({
            tenantId: tenant._id,
            userId: user._id,
            title,
            content
        });

        const savedNote = await newNote.save();

        return NextResponse.json({ success: true, message: "Note created", note: savedNote }, { status: 201 });
    } catch (error) {
        console.error("Error creating note:", error);
        return NextResponse.json({ success: false, message: "Error creating note" }, { status: 500 });
    }
}

//List all notes for the current tenant
export async function GET(req: NextRequest) {
    const user = await requireAdmin(req);
    if (!user || 'status' in user) {
        return user || NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Find tenant
    const tenant = await TenantModel.findById(user.tenantId);
    if (!tenant) {
        return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    try { 
        const notes = await NoteModel.find({ tenantId: tenant._id });
        return NextResponse.json({ success: true, message:"Notes fetched successfully",notes }, { status: 200 });
    } catch (error) {
        console.error("Error fetching notes:", error);
        return NextResponse.json({ success: false, message: "Error fetching notes" }, { status: 500 });
    }
}
