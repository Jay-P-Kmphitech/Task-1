export class AppError extends Error {
    readonly statusCode: number
    readonly debugMessage: string | null
    readonly isOperational = true;

    constructor(
        message: string,
        statusCode: number = 500,
        debugMessage: string | null = null,
    ) {
        super(message)
        this.name = "AppError"
        this.statusCode = statusCode
        this.debugMessage = debugMessage

        Object.setPrototypeOf(this, AppError.prototype)
    }
}
