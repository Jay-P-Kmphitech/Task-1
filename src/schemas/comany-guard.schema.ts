import { Schema, Types } from "mongoose";

export interface CompanyGuard extends Document {
    companyId: Types.ObjectId;
    guardId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const companyGuardSchema = new Schema<CompanyGuard>({
    companyId: { type:Types.ObjectId, ref: "Company", required: true },
    guardId: { type:Types.ObjectId, ref: "Guard", required: true },
}, { timestamps: true });

companyGuardSchema.index({ companyId: 1, guardId: 1 }, { unique: true });

export default companyGuardSchema;