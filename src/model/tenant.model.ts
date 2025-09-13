import mongoose from 'mongoose';

export enum SubscriptionPlan {
  FREE = "FREE",
  PRO = "PRO",
  ENTERPRISE = "ENTERPRISE",
}

export interface Tenant extends Document{
    name: string;
    subscription: SubscriptionPlan;
    createdAt: Date;
    updatedAt: Date;
}
const TenantSchema = new mongoose.Schema<Tenant>({
    name: { 
        type: String, 
        required: true 
    },
    subscription: { 
        type: String, 
        enum: Object.values(SubscriptionPlan),
        default: SubscriptionPlan.FREE,
    },
}, { timestamps: true });

const TenantModel = mongoose.model<Tenant>('Tenant', TenantSchema);
export default TenantModel;
