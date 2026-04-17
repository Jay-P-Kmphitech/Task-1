import { Document, Schema, Types } from "mongoose";

export interface Shift extends Document {
  companyId: Types.ObjectId;
  shiftName: string;
  startDateTime: Date;
  endDateTime: Date;
  location: string;
  media: Array<string> | null;
}

const shiftSchema = new Schema<Shift>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    shiftName: { type: String, required: true },
    startDateTime: { type: Date, required: true },
    endDateTime: { type: Date, required: true },
    location: { type: String, required: true },
    media: { type: [String], default: null },
  },
  { timestamps: true },
);

export default shiftSchema;
