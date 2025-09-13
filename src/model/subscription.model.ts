import mongoose,{ Schema, model, Document} from "mongoose";
import { Tenant, SubscriptionPlan } from "@/model/tenant.model";

export interface Subscription extends Document {
  tenantId: Schema.Types.ObjectId | Tenant;
  plan: SubscriptionPlan;
  maxUsers: number;
  maxNotes: number;
  validUntil: Date;
}

const subscriptionSchema = new Schema<Subscription>(
  {
    tenantId: { 
        type: Schema.Types.ObjectId, 
        ref: "Tenant", 
        unique: true 
    },
    plan: {
      type: String,
      enum: Object.values(SubscriptionPlan),
      required: true,
    },
    maxNotes: { 
        type: Number, required: true 
    },
    validUntil: { 
        type: Date, required: true 
    },
  },
  { timestamps: true }
);

export default mongoose.models.Subscription || model<Subscription>("Subscription", subscriptionSchema);
