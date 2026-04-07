import mongoose from "mongoose"
import dns from "node:dns"
import env from "./env"

dns.setServers(["8.8.8.8", "1.1.1.1"])


const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(env.mongoose_url,
            {
                appName: "Cluster0",
                family: 4,
            }
        )

        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        if (error instanceof Error) {
            console.error("Database connection failed:", error.message)
        } else {
            console.error("Database connection failed with an unknown error:", error)
        }
        process.exit(1) // Exit process on failure
    }
}

export default connectDB

