import { Router } from "express"
import CompanyRouter from "./company.routes"

const router = Router()

router.use('/company', CompanyRouter)

export default router

