import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import mongoose from "mongoose";

await dbConnect()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {tenantId, username, email, password, role} = reqBody

        console.log(reqBody);

        // Validate tenantId is a valid ObjectId
        if (!tenantId || !mongoose.Types.ObjectId.isValid(tenantId)) {
            return NextResponse.json({error: "Valid tenantId is required"}, {status: 400})
        }

        // Convert tenantId to ObjectId
        const tenantObjectId = new mongoose.Types.ObjectId(tenantId);

        //check if user already exists within the same tenant
        const user = await UserModel.findOne({
            tenantId: tenantObjectId,
            email: email
        })

        if(user){
            return NextResponse.json({error: "User already exists in this tenant"}, {status: 400})
        }

        //hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new UserModel({
            tenantId: tenantObjectId,
            username,
            email,
            password: hashedPassword,
            role: role || "MEMBER"
        })

        const savedUser = await newUser.save()
        console.log(savedUser);


        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        })
        
        


    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Signup failed';
        return NextResponse.json({error: errorMessage}, {status: 500})

    }
}