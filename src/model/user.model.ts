import mongoose , { Schema,Document,Model} from "mongoose";
import { Tenant } from "@/model/tenant.model";

export enum Role {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER"
}

export interface User extends Document{
    tenantId: Schema.Types.ObjectId | Tenant;
    email: string;
    username: string;
    password: string;
    role: Role;
    isAddingMembers: boolean;
    isUpgradingPlan: boolean;
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
    username: { 
      type: String, 
      required: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      enum: Object.values(Role), 
      default: Role.MEMBER 
    },
    isAddingMembers: { 
      type: Boolean, 
      default: false 
    },
    isUpgradingPlan: { 
      type: Boolean, 
      default: false 
    },
}, { timestamps: true });

const UserModel : Model<User> = mongoose.models.User || mongoose.model<User>('User', UserSchema);

export default UserModel;
