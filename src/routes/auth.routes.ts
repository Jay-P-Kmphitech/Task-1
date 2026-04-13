import { Router } from "express"
import fs from "fs"
import multer from "multer"
import { v4 } from "uuid"
import controller from "../controllers/auth.controller"
import { validate } from "../middlewares/validation.middleware"
import { AppError } from "../utils/appError"
import authValidator from "../validations/auth.validations"

const AuthRouter = Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'public/'

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }

        cb(null, dir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = v4()
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

const mediaAwareFileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // If the field name is "media", accept all files (no filter)

    if (file.fieldname === "media") {
        cb(null, true)
    } else {
        // Otherwise, only allow image files
        if (file.mimetype.startsWith("image/")) {
            cb(null, true)
        } else {
            throw new AppError("Only image files are allowed!", 400)
        }
    }
}

const bucket = multer({ storage: storage, fileFilter: mediaAwareFileFilter })

AuthRouter.post(
    '/register',
    bucket.fields([
        { name: 'profile', maxCount: 1 },
        { name: 'media', maxCount: 10 }, // adjust maxCount as needed
    ]),
    validate(authValidator.register, ["body"], "files"),
    controller.registerHandler
)

AuthRouter.post('/login', validate(authValidator.login), controller.loginHandler)

export default AuthRouter