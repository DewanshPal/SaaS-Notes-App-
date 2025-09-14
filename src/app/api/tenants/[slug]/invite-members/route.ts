import dbConnect from "@/lib/dbConnection";
import { requireAdmin } from "@/lib/auth";
import TenantModel from "@/model/tenant.model";
import { NextRequest } from "next/server";
import UserModel from "@/model/user.model";
import bcryptjs from "bcryptjs";

await dbConnect();

interface RouteParams {
    params: Promise<{ slug: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
    const { slug } = await params;

    //checking user is admin
    const user = await requireAdmin(req);
    if (!user || 'status' in user)
    {
        return user || Response.json({success: false,message: "Unauthorized" }, { status: 401 });
    }
    //extract tenant from slug
    const tenant = await TenantModel.findOne({ slug: slug });
    if (!tenant) {
        return Response.json({ success: false, message: "Tenant not found" }, { status: 404 });
    }

    //Ensure admin belongs to this tenant
    if (user.tenantId.toString() !== tenant._id.toString()) {
        return Response.json({ success: false, message: "Not part of this tenant" }, { status: 403 });
    }

      //check admin toggle is true
    if(!user.isAddingMembers)
    {
        return Response.json({ success: false, message: "Toggle is off to add members" }, { status: 403 });
    }
    
    try{
        
        //Creating new Members for the Tenant
        const {username, email, role } = await req.json();

        //check if user already exists within the same tenant
        const existingUser = await UserModel.findOne({
            tenantId: tenant._id,
            email: email
        })
        
        if(existingUser){
            return Response.json({success: false, message: "User already exists in this tenant"}, {status: 400})
        }

        //hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash("password", salt)

        //add the member
        const newMember = new UserModel({
            tenantId:tenant._id,
            username,
            email,
            password:hashedPassword,
            role
        });

        const savedMember = await newMember.save();
        console.log("New Member Added:", savedMember);

        return Response.json({ success: true, message: `Member added to tenant ${slug}!` });
    } catch(error)
    {
        const errorMessage = error instanceof Error ? error.message : 'internal server error';
        return Response.json({success: false, message: errorMessage}, {status: 500})
    }
}
