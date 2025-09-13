import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/user.model";
import TenantModel from "@/model/tenant.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

await dbConnect();

export async function POST(request: NextRequest){
    try{
        const reqBody = await request.json() // sends the promise
        const {email, password} = reqBody;

        //check if user exists
        const user = await UserModel.findOne({email})

        
        if(!user){
            return NextResponse.json({error: "Invalid email"}, {status: 400})
        }

        console.log("User Exists")

        const validPassword = await bcryptjs.compare(password, user.password)
       if(!validPassword){
        return NextResponse.json({error: "Invalid password"}, {status: 400})
       }
       //check whether tenantId is valid
         const tenant = await TenantModel.findById(user.tenantId)
         if(!tenant){
            return NextResponse.json({error: "this Tenant is not Registered"}, {status: 400})
         }
            console.log("Tenant Exists")
       //create token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }
        // process.env.JWT_SECRET_KEY! the exclamation mark is used to tell typescript that this variable will never be null or undefined

        const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY!, {expiresIn: "1d"})

         const response = NextResponse.json({
            message: "Login successful",
            success: true,
        })
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
              
        })
        return response;

    }
    catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Login failed';
        return NextResponse.json({error: errorMessage}, {status: 500})

    }
}