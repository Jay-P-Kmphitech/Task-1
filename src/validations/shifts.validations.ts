import Joi from "joi";

const shiftsValidator = {
    createShift: Joi.object({
        shiftName: Joi.string().required(),
        startDateTime: Joi.date().required(),
        endDateTime: Joi.date()
            .required()
            .custom((value, helpers) => {
                // Custom validation to ensure that endDateTime is after startDateTime
                // Extract startDateTime from the parent object in the validation context
                const { startDateTime } = helpers.state.ancestors[0];

                // Compare endDateTime (value) with startDateTime
                // If endDateTime is less than or equal to startDateTime, return a validation error
                if (value <= startDateTime) {
                    return helpers.error("date.greater", {
                        message: "End date/time must be after start date/time."
                    });
                }

                // If validation passes, return the value as valid
                return value;
            })
            .messages({
                "any.required": "End date/time is required.",
                "date.greater": "End date/time must be after start date/time.",
            }),

        location: Joi.string().required(),
        media: Joi.array().items(Joi.string()).optional(),
    }),

    getAllShifts: Joi.object({
        status: Joi.string().valid("active", "inactive").optional(),
    }),

    getShiftsByCompany: Joi.object({
        companyId: Joi.string().required(),
    }),

    getShiftById: Joi.object({
        shiftId: Joi.string().required(),
    }),

    updateShift: Joi.object({
        shiftId: Joi.string().required(),
        shiftName: Joi.string().optional(),
        startDateTime: Joi.string().optional(),
        endDateTime: Joi.string().optional(),
        location: Joi.string().optional(),
        media: Joi.array().items(Joi.string()).optional(),
    }),

    deleteShift: Joi.object({
        shiftId: Joi.string().required(),
    }),

    getShiftsByDateRange: Joi.object({
        startDate: Joi.string().required(),
        endDate: Joi.string().required(),
    }),

    getShiftsByLocation: Joi.object({
        location: Joi.string().required(),
    }),
}

export default shiftsValidator