import { NextFunction, Request, Response } from "express"
import { ObjectSchema } from "joi"
import { AppError } from "../utils/appError"

type ValidationType = "body" | "query" | "params"
type ValidationFileType = "files" | "file"

export const validate = (schema: ObjectSchema, types: Array<ValidationType> = ["body"], fileValidation?: ValidationFileType) => {
    return (req: Request, res: Response, next: NextFunction) => {


        // Ensure req[type] exists before validating, otherwise send a 400 error
        let body: any | null = null

        if (fileValidation) {
            if (fileValidation == "files") {
                body = {
                    ...req.body,
                    ...req.files,
                }
            } else if (fileValidation == "file") {
                body = {
                    ...req.body, file: req.file
                }
            }
        }

        for (const element of types) {
            let reqElement
            const isBody = element === "body"
            if (isBody) {
                reqElement = body ?? req[element]
            } else {
                reqElement = req[element]
            }
            if (!reqElement) {
                throw new AppError(`Missing request ${types}`, 400)
            }

            console.log(reqElement)


            const { error, value } = schema.validate(reqElement, {
                abortEarly: false,
                stripUnknown: true,
            })

            if (error) {
                next(error)
            }

            if (isBody) {
                if (value && typeof value === 'object') {
                    if ('files' in value) {
                        delete value.files
                    }
                    if ('file' in value) {
                        delete value.file
                    }
                }

            }

            req[element] = value
        }

        next()
    }
}
