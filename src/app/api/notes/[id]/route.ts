import dbConnect from "@/lib/dbConnection";
import NoteModel from "@/model/notes.model";
import TenantModel from "@/model/tenant.model";
import { requireMember } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

await dbConnect();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await requireMember(req);
    if (!user || 'status' in user) {
        return user || NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Find tenant
    const tenant = await TenantModel.findById(user.tenantId);
    if (!tenant) {
        return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    try {
        // Find note by id given in params and ensure it belongs to the tenant and user
        const note = await NoteModel.findOne({ _id: params.id, tenantId: tenant._id, userId: user._id });
        if (!note) {
            return NextResponse.json({ success: false, message: "Note not found" }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, note }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Error retrieving note" }, { status: 500 });
    }
} 

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await requireMember(req);
    if (!user || 'status' in user) {
        return user || NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Find tenant
    const tenant = await TenantModel.findById(user.tenantId);
    if (!tenant) {
        return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    try {
        const { title, content } = await req.json();

        // Find and update note by id given in params and ensure it belongs to the tenant and user
        const updatedNote = await NoteModel.findOneAndUpdate(
            { _id: params.id, tenantId: tenant._id, userId: user._id },
            { title, content },
            { new: true }
        );

        if (!updatedNote) {
            return NextResponse.json({ success: false, message: "Note not found or not authorized" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Note updated", note: updatedNote }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Error updating note" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await requireMember(req);
    if (!user || 'status' in user) {
        return user || NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Find tenant
    const tenant = await TenantModel.findById(user.tenantId);
    if (!tenant) {
        return NextResponse.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    try {
        // Find and delete note by id given in params and ensure it belongs to the tenant and user
        const deletedNote = await NoteModel.findOneAndDelete({ _id: params.id, tenantId: tenant._id, userId: user._id });
        if (!deletedNote) {
            return NextResponse.json({ success: false, message: "Note not found or not authorized" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Note deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Error deleting note" }, { status: 500 });
    }
}   