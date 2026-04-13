import jwt from "jsonwebtoken"
import env from "../config/env"
import { AppError } from "./appError"

interface TokenPayload {
    id: string
    email: string
    role: string
}

class JwtUtils {
    private secretKey: string

    constructor(secretKey: string) {
        this.secretKey = secretKey
    }

    generateToken(payload: TokenPayload): string {
        return jwt.sign(payload, this.secretKey, { expiresIn: "1d" })
    }

    generateRefreshToken(payload: TokenPayload): string {
        return jwt.sign(payload, this.secretKey, { expiresIn: "30d" })
    }

    verifyToken(token: string): TokenPayload {
        try {
            const decoded = jwt.verify(token, this.secretKey) as TokenPayload
            return decoded
        } catch (error) {
            throw new AppError("Invalid or expired token", 401)
        }
    }

    extractTokenFromHeader(authHeader?: string): string {
        if (!authHeader) {
            throw new AppError("Authorization header is missing", 401)
        }

        const parts = authHeader.split(" ")
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            throw new AppError("Invalid authorization header format", 401)
        }

        return parts[1]
    }
}

export const jwtUtils = new JwtUtils(env.jwtSecrete)
