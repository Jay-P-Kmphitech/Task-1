import Joi from "joi"

const validator = {
    register: Joi.object(
        {
            email: Joi.string().trim().email({ tlds: { allow: false } }).lowercase().required(),
            password: Joi.string().trim().length(32).hex().required()
        }
    )
}