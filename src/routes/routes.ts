import { Router } from "express"
import AuthRouter from "./auth.routes"
import GuardShiftRouter from "./guard-shift.routes"
import CompanyRouter from "./company.routes"
import ShiftsRouter from "./shifts.routes"

const router = Router()

router.use("/auth", AuthRouter)

router.use("/company", CompanyRouter)

router.use("/shifts", ShiftsRouter)

router.use("/guard-shifts", GuardShiftRouter)

export default router