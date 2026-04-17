import { Document, Schema } from "mongoose"

export interface User extends Document {
    email: String,
    passwordHash?: String | null,
    role: UserRole
    phone: String,
    name: String,
    profile?: String,
}

export enum UserRole {
    admin = "admin",
    company = "company",
    client = "client",
    guard = "guard",
}

const userSchema = new Schema<User>({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
    },
    passwordHash: {
        type: String,
    },
    role: {
        type: String,
        required: [true, "Role is required"],
        enum: Object.values(UserRole),
    },
    phone: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    profile: {
        type: String,
    }
})


export default userSchema