import mongoose from "mongoose"
import userRepo from "../repository/user.repository"
import { Days, EmploymentType } from "../schemas/guard.schema"
import { UserRole } from "../schemas/user.schema"
import { AppError } from "../utils/appError"
import { passwordHashUtils } from "../utils/bcrypt.utils"
import { jwtUtils } from "../utils/jwt.utils"

const authService = {
    async register(arg: {
        email: string,
        password: string,
        name: string,
        profile?: string,
        phone: string,
        role: UserRole,
        media?: Express.Multer.File[],
        availability?: Array<Days>,
        maxHoursPerWeek?: number,
        employmentType?: EmploymentType
    }) {
        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            let response: Object | null
            var result = await userRepo.createUser(arg.role, arg.email, arg.password, arg.name, arg.phone, session)

            switch (arg.role) {
                case UserRole.client:
                    response = await result.createClient(arg.profile!)
                    break
                case UserRole.guard:
                    response = await result.createGuard(arg.availability!, arg.employmentType!, arg.maxHoursPerWeek!, arg.profile!)
                    break
                case UserRole.company:
                    response = await result.createCompany(arg.media!)
                    break
                default:
                    response = null
                    break
            }

            await session.commitTransaction()
            console.log(response)
            return response
        } catch (error) {
            await session.abortTransaction()
            throw error
        } finally {
            await session.endSession()
        }
    },

    async login(arg: { email: string; password: string }): Promise<{ token: string; user: Object }> {

        var result = await userRepo.findByEmail(arg.email)

        console.log("result", result)


        if (result !== null) {
            console.log()
            const isMatch = await passwordHashUtils.compareValue(arg.password, (result as any).passwordHash)

            if (isMatch) {
                const token = jwtUtils.generateToken({
                    id: (result as any)._id.toString(),
                    email: (result as any).email,
                    role: (result as any).role,
                })
                return { token, user: result }
            }
        }

        throw new AppError("Invalid email or password", 401)
    },
}

export default authService