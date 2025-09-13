import mongoose , { Schema,Document } from "mongoose";
import { Tenant } from "@/model/tenant.model";

export enum Role {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER"
}

export interface User extends Document{
    tenantId: Schema.Types.ObjectId | Tenant;
    email: string;
    name: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}
const UserSchema = new mongoose.Schema<User>({
    
    tenantId: { 
      type: Schema.Types.ObjectId, 
      ref: "Tenant", 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    name: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      enum: Object.values(Role), 
      default: Role.MEMBER 
    },
}, { timestamps: true });

const UserModel = mongoose.model<User>('User', UserSchema);

export default UserModel;
