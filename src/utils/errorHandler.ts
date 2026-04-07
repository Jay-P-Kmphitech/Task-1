import { NextFunction, Request, Response } from "express"
import { ValidationError as JoiValidationError } from "joi"
import { Error as MongooseError } from "mongoose"
import { AppError } from "../utils/appError"

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    if (err.debugMessage) {
      console.error(`[AppError ${err.statusCode}] ${err.debugMessage}`)
    }
    return res.failed({
      data: { status: "error", error: err.message },
      statusCode: err.statusCode,
    })
  }

  if (err instanceof JoiValidationError) {
    const fields = err.details.map((d) => ({
      field: d.context?.label ?? d.path.join("."),
      message: d.message.replace(/['"]/g, ""),
    }))

    console.error("[JoiValidation 400]", fields)
    return res.failed({
      data: { status: "validation_error", error: "Validation failed", fields },
      statusCode: 400,
    })
  }

  if (err instanceof MongooseError.ValidationError) {
    const fields = Object.entries(err.errors).map(([key, val]) => ({
      field: key,
      message: val.message,
    }))

    console.error("[MongooseValidation 400]", fields)
    return res.failed({
      data: { status: "validation_error", error: "Database validation failed", fields },
      statusCode: 400,
    })
  }

  if (err instanceof MongooseError.CastError) {
    console.error(`[CastError 400] Path: ${err.path}, Value: ${err.value}`)
    return res.failed({
      data: {
        status: "error",
        error: `Invalid value for field '${err.path}': ${String(err.value)}`,
      },
      statusCode: 400,
    })
  }

  if (isMongooseDuplicateKeyError(err)) {
    const keyValue = (err as any).keyValue as Record<string, unknown>
    const field = Object.keys(keyValue)[0] ?? "field"
    const value = keyValue[field]
    console.error(`[DuplicateKey 409] ${field}: ${value}`)
    return res.failed({
      data: { status: "error", error: `'${value}' is already taken for '${field}'.` },
      statusCode: 409,
    })
  }

  if (isJwtError(err)) {
    const name = (err as any).name as string
    const isExpired = name === "TokenExpiredError"
    console.error(`[JWT 401] ${name}`)
    return res.failed({
      data: {
        status: "error",
        error: isExpired ? "Token has expired" : "Invalid or malformed token",
      },
      statusCode: 401,
    })
  }

  if (err instanceof SyntaxError && "body" in err) {
    console.error("[SyntaxError 400] Malformed JSON body")
    return res.failed({
      data: { status: "error", error: "Invalid JSON in request body" },
      statusCode: 400,
    })
  }

  console.error("[500] Unhandled error:", err)
  return res.failed({
    data: { status: "error", error: "Internal Server Error" },
    statusCode: 500,
  })
}

function isMongooseDuplicateKeyError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    ((err as any).code === 11000 || (err as any).code === 11001)
  )
}

function isJwtError(err: unknown): boolean {
  if (typeof err !== "object" || err === null) return false
  const name = (err as any).name as string | undefined
  return (
    name === "TokenExpiredError" ||
    name === "JsonWebTokenError" ||
    name === "NotBeforeError"
  )
}
