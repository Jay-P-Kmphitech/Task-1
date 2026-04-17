import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import companyGuardService from "../services/company-guard.service";

const controller = {
  linkGuard: catchAsync(async (req: Request, res: Response) => {
    const { guardId } = req.body;

    const companyId = req.auth!.id;

    const data = await companyGuardService.linkGuard(companyId, guardId);

    return res.success({ data });
  }),

  unlinkGuard: catchAsync(async (req: Request, res: Response) => {
    const { guardId } = req.body;

    const companyId = req.auth!.id;

    const data = await companyGuardService.unlinkGuard(companyId, guardId);

    return res.success({ data });
  }),

  getGuards: catchAsync(async (req: Request, res: Response) => {
    const companyId = req.auth!.id;

    const data = await companyGuardService.getGuards(companyId);

    return res.success({ data });
  }),
};

export default controller;
