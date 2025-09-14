import mongoose,{ Schema, model, Document } from "mongoose";
import { Tenant } from "@/model/tenant.model";
import { User } from "@/model/user.model";

export interface Note extends Document {
  tenantId: Schema.Types.ObjectId | Tenant;
  userId: Schema.Types.ObjectId | User;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<Note>(
  {
    tenantId: { 
        type: Schema.Types.ObjectId, 
        ref: "Tenant", 
        required: true 
    },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
  },
  { timestamps: true }
);

const NoteModel = mongoose.models.Note || model<Note>("Note", noteSchema);

export default NoteModel;
