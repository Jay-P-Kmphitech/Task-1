import mongoose from "mongoose"
import clientModel from "../models/client.model"
import companyModel from "../models/company.model"
import guardModel from "../models/guard.model"
import userModel from "../models/user.model"

import { Days, EmploymentType } from "../schemas/guard.schema"
import { UserRole } from "../schemas/user.schema"
import { passwordHashUtils } from "../utils/bcrypt.utils"

const userRepo = {
    async createUser(role: UserRole, email: string, password: string, name: string, phone: string, session: mongoose.mongo.ClientSession) {
        // create password hash with generateHash method of bcrypt
        const passwordHash = await passwordHashUtils.generateHash(password)

        const result = new userModel({
            email,
            password,
            passwordHash,
            phone,
            role,
        })

        await result.save({ session })

        return {
            async createClient(profile: string) {
                const clientResult = new clientModel({
                    _id: result._id,
                    name: name,
                    profile: profile,
                })

                await clientResult.save({ session })

                return {
                    ...result.toObject(),
                    ...clientResult.toObject(),
                }
            },

            async createGuard(availability: Array<Days>, employmentType: EmploymentType, maxHoursPerWeek: number, profile: string,) {
                const guradResult = new guardModel({
                    _id: result._id,
                    name: name,
                    profile: profile,
                    availability: availability,
                    employmentType: employmentType,
                    maxHoursPerWeek: maxHoursPerWeek,
                })

                await guradResult.save({ session })

                return {
                    ...result.toObject(),
                    ...guradResult.toObject(),
                }
            },

            async createCompany(media: Express.Multer.File[]) {
                const companyResult = new companyModel({
                    _id: result._id,
                    name: name,
                    media: media.map((file) => file.path),
                })

                await companyResult.save({ session })

                return {
                    ...result.toObject(),
                    ...companyResult.toObject(),
                }
            }
        }
    },



    async findByEmail(email: string): Promise<Object | null> {
        const result = await userModel.aggregate([
            {
                $match: {
                    email: email,
                }
            },
            {
                $lookup: {
                    from: "company-details",
                    localField: "_id",
                    foreignField: "_id",
                    as: "companyProfile",
                }
            },
            {
                $lookup: {
                    from: "guard-details",
                    localField: "_id",
                    foreignField: "_id",
                    as: "guardProfile",
                }
            },
            {
                $lookup: {
                    from: "client-details",
                    localField: "_id",
                    foreignField: "_id",
                    as: "clientProfile",
                }
            },
            {
                $addFields: {
                    profile: {
                        $switch: {
                            branches: [
                                {
                                    case: { $eq: ["$role", "company"] },
                                    then: { $arrayElemAt: ["$companyProfile", 0] },
                                },
                                {
                                    case: { $eq: ["$role", "guard"] },
                                    then: { $arrayElemAt: ["$guardProfile", 0] },
                                },
                                {
                                    case: { $eq: ["$role", "client"] },
                                    then: { $arrayElemAt: ["$clientProfile", 0] },
                                },
                            ],
                            default: null,
                        }
                    }
                }
            },
            {
                $project: {
                    companyProfile: 0,
                    guardProfile: 0,
                    clientProfile: 0,
                }
            },
            { $limit: 1 }
        ])

        return result[0] ?? null
    }
}

export default userRepo