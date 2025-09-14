import { requireAdmin } from "@/lib/auth";
import TenantModel from "@/model/tenant.model";
import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnection";

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
    if(!user.isUpgradingPlan)
    {
        return Response.json({ success: false, message: "Toggle is off to upgrade plan" }, { status: 403 });
    }
    try{
        //Upgrading the tenant plan
        tenant.subscription = "PRO";
        tenant.noteLimit = null; // Unlimited notes
        await tenant.save();
    } catch (error) {
        console.error("Error upgrading tenant:", error);
        return Response.json({ success: false, message: "Failed to upgrade tenant" }, { status: 500 });
    }

  return Response.json({ success: true, message: `Tenant ${slug} upgraded!` });
}
