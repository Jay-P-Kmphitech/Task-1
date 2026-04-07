import app from "./app"
import connectDB from "./config/db"
import env from "./config/env"

connectDB().then(
    () => {
        app.listen(env.port, (_) => {
            console.log(`Server running at http://localhost:${env.port}`)
        })
    }
)
