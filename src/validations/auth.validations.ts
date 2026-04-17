import Joi from "joi"
import { Days } from "../schemas/guard.schema"

const _fileSchema = (fieldName?: string) => Joi.object({
    fieldname: fieldName ? Joi.string().valid(fieldName) : Joi.optional(),
    /* originalname: Joi.string()
        .required()
        .messages({
            "string.base": "Original name must be a string.",
            "string.empty": "Original name must not be empty.",
            "any.required": "Original name is required."
        }),
    mimetype: Joi.string()
        .valid('image/png', 'image/jpeg')
        .required()
        .messages({
            "string.base": "Mimetype must be a string.",
            "any.only": "Mimetype must be either 'image/png' or 'image/jpeg'.",
            "any.required": "Mimetype is required.",
            "string.empty": "Mimetype must not be empty."
        }),
    size: Joi.number()
        .max(2 * 1024 * 1024)
        .required()
        .messages({
            "number.base": "Size must be a number.",
            "number.max": "Size must not exceed 2MB.",
            "any.required": "Size is required."
        }),
    path: Joi.string()
        .required()
        .messages({
            "string.base": "Path must be a string.",
            "string.empty": "Path must not be empty.",
            "any.required": "Path is required."
        }), */
})


const fileSchema = (fieldName: Array<string>) => {
    const object: any = {}

    for (const element of fieldName) {
        object[element] = _fileSchema(element).required()
    }

    return Joi.object(object)
}

const emailAndPasswordFields = {
    email: Joi.string()
        .trim()
        .email({ tlds: { allow: false } })
        .lowercase()
        .required()
        .messages({
            "string.base": "Email must be a string.",
            "string.empty": "Email must not be empty.",
            "string.email": "Email must be a valid email address.",
            "any.required": "Email is required."
        }),
    password: Joi.string()
        .trim()
        .length(32)
        .hex()
        .required()
        .messages({
            "string.base": "Password must be a string.",
            "string.empty": "Password must not be empty.",
            "string.length": "Password must be exactly 32 characters long.",
            "string.hex": "Password must consist of hexadecimal characters only.",
            "any.required": "Password is required."
        })
}

const authValidator = {
    register: Joi.object(
        {
            ...emailAndPasswordFields,
            name: Joi.string()
                .trim()
                .required()
                .messages({
                    "string.base": "Name must be a string.",
                    "string.empty": "Name must not be empty.",
                    "any.required": "Name is required."
                }),
            role: Joi.string()
                .valid("company", "guard", "client")
                .required()
                .messages({
                    "any.only": "Role must be either 'company', 'guard', or 'client'.",
                    "string.base": "Role must be a string.",
                    "any.required": "Role is required.",
                    "string.empty": "Role must not be empty."
                }),
            /**
             * availability: An array of string days from ['mon','tue','wed','thu','fri','sat','sun'].
             * 
             * Example (in Postman, for key "availability[]"):
             * 
             *   Key:   availability[]      Value: mon
             *   Key:   availability[]      Value: tue
             *   Key:   availability[]      Value: fri
             *
             * Or as raw JSON (body/raw, JSON):
             * 
             *   "availability": ["mon", "tue", "fri"]
             */
            availability: Joi.array()
                .items(Joi.string().valid(...Object.values(Days)))
                .min(1)
                .messages({
                    "array.base": "Availability must be an array of days.",
                    "array.includes": "Availability must only contain valid days.",
                    "array.min": "At least one availability day must be specified for guards.",
                    "string.base": "Each availability day must be a string.",
                    "any.only": "Each availability day must be one of 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', or 'sun'."
                }),

            employmentType: Joi.string()
                .valid('full-time', 'part-time')
                .messages({
                    "string.base": "Employment type must be a string.",
                    "any.only": "Employment type must be either 'full-time' or 'part-time'.",
                    "string.empty": "Employment type must not be empty.",
                }),
            maxHoursPerWeek: Joi.number()
                .greater(0)
                .messages({
                    "number.base": "Max hours per week must be a number.",
                    "number.greater": "Max hours per week must be greater than 0.",
                }),
            phone: Joi.string()
                .trim()
                .pattern(/^[0-9+\-()\s]+$/)
                .min(7)
                .max(20)
                .required()
                .messages({
                    "string.base": "Phone must be a string.",
                    "string.empty": "Phone must not be empty.",
                    "string.pattern.base": "Phone must be a valid phone number.",
                    "string.min": "Phone must be at least 7 characters long.",
                    "string.max": "Phone must be at most 20 characters long.",
                    "any.required": "Phone is required."
                }),
            files: {
                profile: Joi.any(),
                media: Joi.any(),
            }
        }
    ).when(
        Joi.object({ role: Joi.valid("guard", "client") }),
        {
            then: Joi.object({
                files: {
                    profile: Joi.required().messages({
                        "any.required": "Profile image is required for guards and clients."
                    })
                }
            }),
            otherwise: Joi.object({
                files: { profile: Joi.forbidden() }
            })
        }
    ).when(
        Joi.object({ role: Joi.valid("guard") }),
        {
            then: Joi.object({
                availability: Joi.required().messages({
                    "any.required": "Availability is required for guards."
                }),
                employmentType: Joi.required().messages({
                    "any.required": "Employment type is required for guards."
                }),
                maxHoursPerWeek: Joi.required().messages({
                    "any.required": "Max hours per week is required for guards."
                })

            }),
            otherwise: Joi.object({
                availability: Joi.forbidden(),
                employmentType: Joi.forbidden(),
                maxHoursPerWeek: Joi.forbidden(),
            }),
        }
    ).when(
        Joi.object({ role: Joi.valid("company") }),
        {
            otherwise: {
                files: {
                    media: Joi.forbidden()
                }
            }
        }
    ),

    login: Joi.object(emailAndPasswordFields),
}

export default authValidator