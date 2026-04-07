import type { Response } from 'express'

declare global {
    namespace Express {
        interface Request {
            auth?: Record<string, unknown>
        }

        interface Response {
            success<T>(arg: _IResponseParams<T>): this
            failed<T>(arg: _IResponseParams<T>): this
        }
    }
}

function success<T>(this: Response, arg: _IResponseParams<T>): Response {
    const { data, statusCode = 200, message = 'Success', version } = arg
    return this.status(statusCode).json({
        data,
        message,
        version,
    })
}
(Response.prototype as any).success = success

function failed<T>(this: Response, arg: _IResponseParams<T>): Response {
    const { data, statusCode = 500, message = 'Failed!', version } = arg
    return this.status(statusCode).json({
        data,
        message,
        version,
    })
}
(Response.prototype as any).failed = failed


interface _IResponseParams<T> {
    data: T
    statusCode?: number,
    message?: string,
    version?: string
}

export { };

