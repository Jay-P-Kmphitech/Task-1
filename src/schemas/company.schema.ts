import { Document, Schema, Types } from "mongoose"

export interface Company extends Document {
    userId: Types.ObjectId,
    media?: Array<string>,
}

const companySchema = new Schema<Company>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Users",
    },
    media: [String],
})

export default companySchema