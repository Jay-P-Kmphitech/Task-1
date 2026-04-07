import { NextFunction, Request, Response } from "express"
import service from "../services/company.service"

const controller = {
    registerHandler: (req: Request, res: Response, next: NextFunction) => {

    },

    loginHandler: (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body
        service.login({ email: email, password: password })
    }
}


export default controller