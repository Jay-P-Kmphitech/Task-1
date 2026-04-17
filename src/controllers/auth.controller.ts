import { Request, Response } from "express"
import { Days, EmploymentType } from "../schemas/guard.schema"
import { UserRole } from "../schemas/user.schema"
import authService from "../services/auth.service"
import catchAsync from "../utils/catchAsync"

export interface RegisterRequest {
    email: string,
    password: string,
    name: string,
    phone: string,
    role: UserRole,
    profile?: string,
    media?: [string],
    availability?: Array<Days>,
    employmentType?: EmploymentType,
    maxHoursPerWeek?: number,
}

const controller = {
    registerHandler: async (req: Request, res: Response) => {
        const body = req.body

        const files = req.files

        let profile: string | undefined = undefined
        let media: [string] | undefined = undefined



        if (files && typeof files === 'object') {
            if ('profile' in files) { profile = files['profile'][0].filename }
            else if ('media' in files) { media = files['media'].map(file => file.filename) as [string] }
        }

        const dto: RegisterRequest = {
            email: body.email,
            password: body.password,
            name: body.name,
            phone: body.phone,
            role: body.role,
            profile: profile,
            media: media,
            availability: body.availability,
            employmentType: body.employmentType,
            maxHoursPerWeek: body.maxHoursPerWeek,
        }

        const data = await authService.register(dto);

        return res.success({ data });


    },

    loginHandler:
        catchAsync(async (req: Request, res: Response) => {
            const { email, password } = req.body ?? {}

            const data = await authService.login({ email, password })

            return res.success({ data })

        })
}


export default controller