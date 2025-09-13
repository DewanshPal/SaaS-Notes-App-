import mongoose from 'mongoose';

export enum SubscriptionPlan {
  FREE = "FREE",
  PRO = "PRO",
  ENTERPRISE = "ENTERPRISE",
}

export interface Tenant extends Document{
    name: string;
    slug: string;
    subscription: SubscriptionPlan;
    createdAt: Date;
    updatedAt: Date;
}
const TenantSchema = new mongoose.Schema<Tenant>({
    name: { 
        type: String, 
        required: true 
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    subscription: { 
        type: String, 
        enum: Object.values(SubscriptionPlan),
        default: SubscriptionPlan.FREE,
    },
}, { timestamps: true });

const TenantModel = mongoose.models.Tenant || mongoose.model<Tenant>('Tenant', TenantSchema);
export default TenantModel;
