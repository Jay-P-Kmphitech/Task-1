import { Document, Schema, Types } from "mongoose"

export interface Guard extends Document {
    userId: Types.ObjectId,
    availability: Array<Days>,
    employmentType: EmploymentType,
    maxHoursPerWeek: Number,
}

export enum EmploymentType {
    FullTime = "full-time",
    PartTime = "part-time"
}

export enum Days {
    Mon = "mon",
    Tue = "tue",
    Wed = "wed",
    Thu = "thu",
    Fri = "fri",
    Sat = "sat",
    Sun = "sun"
}

const guardSchema = new Schema<Guard>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "Users",
        },
        availability: {
            type: [String],
            enum: Object.values(Days),
            required: true,
        },
        employmentType: {
            type: String,
            enum: EmploymentType,
            required: true,
        },
        maxHoursPerWeek: {
            type: Number,
            required: true,
        }
    },
    { timestamps: true }
)

export default guardSchema