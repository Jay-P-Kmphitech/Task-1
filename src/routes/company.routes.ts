import { Router } from "express"
import controller from "../controllers/company.controller"

const CompanyRouter = Router()

CompanyRouter.post('/register', controller.registerHandler)

CompanyRouter.post('/login', controller.registerHandler)

export default CompanyRouter