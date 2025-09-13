import dbConnect from "@/lib/dbConnection";
import TenantModel, { SubscriptionPlan } from "@/model/tenant.model";
import { NextRequest, NextResponse } from "next/server";

await dbConnect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { name, subscription } = reqBody;

        console.log(reqBody);

        // Validate required fields
        if (!name) {
            return NextResponse.json({
                error: "Tenant name is required"
            }, { status: 400 });
        }

        // Validate subscription plan if provided
        if (subscription && !Object.values(SubscriptionPlan).includes(subscription)) {
            return NextResponse.json({
                error: "Invalid subscription plan. Must be FREE or PRO"
            }, { status: 400 });
        }

        // Check if tenant with same name already exists
        const existingTenant = await TenantModel.findOne({name});

        if (existingTenant) {
            return NextResponse.json({
                error: "Tenant with this name already exists choose a different name"
            }, { status: 400 });
        }

        // Create new tenant
        const newTenant = new TenantModel({
            name: name,
            subscription: subscription || SubscriptionPlan.FREE
        });

        const savedTenant = await newTenant.save();
        console.log("Tenant created:", savedTenant);

        // Return success response
        return NextResponse.json({
            message: "Tenant created successfully",
            success: true,
            tenant: {
                id: savedTenant._id,
                name: savedTenant.name,
                subscription: savedTenant.subscription,
                createdAt: savedTenant.createdAt
            }
        }, { status: 201 });

    } catch (error: unknown) {
        console.error("Registration error:", error);
        const errorMessage = error instanceof Error ? error.message : 'Tenant registration failed';
        return NextResponse.json({
            error: errorMessage
        }, { status: 500 });
    }
}