import { Document, Schema, Types } from "mongoose";

export interface GuardShift extends Document {
  guardId: Types.ObjectId;
  shiftId: Types.ObjectId;
  status: GuardShiftStatus;
  assignedAt: Date;
}

export enum GuardShiftStatus {
  Assigned = "assigned",
  InProgress = "in-progress",
  Completed = "completed",
  Cancelled = "cancelled",
}

const guardShiftSchema = new Schema<GuardShift>(
  {
    guardId: {
      type: Schema.Types.ObjectId,
      ref: "guard-details",
      required: true,
    },
    shiftId: {
      type: Schema.Types.ObjectId,
      ref: "shift-details",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(GuardShiftStatus),
      default: GuardShiftStatus.Assigned,
      required: true,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { timestamps: true },
);

// Compound index to ensure a guard cannot be assigned to the same shift twice
guardShiftSchema.index({ guardId: 1, shiftId: 1 }, { unique: true });

export default guardShiftSchema;
