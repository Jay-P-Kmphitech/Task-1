import dotEnv from "dotenv"

dotEnv.config({ quiet: true })

function _getMongoDbUrl(): string {
    const MONGODB_URL = process.env.MONGODB_URL
    if (!MONGODB_URL) {
        throw new Error("MONGODB_URL environment variable is not set.")
    }
    return MONGODB_URL
}

function _getPort(): string {
    const PORT = process.env.PORT
    if (!PORT) {
        throw new Error("PORT environment variable is not set.")
    }
    return PORT
}

function _getJwtSecrate(): string {
    const JWT_SECRATE = process.env.JWT_SECRATE
    if (!JWT_SECRATE) {
        throw new Error("JWT_SECRATE environment variable is not set.")
    }
    return JWT_SECRATE
}

export default {
    mongoose_url: _getMongoDbUrl(),
    port: _getPort(),
    jwtSecrate: _getJwtSecrate(),
}