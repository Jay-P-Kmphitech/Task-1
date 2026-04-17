import { Request, Response } from "express";
import guardShiftService from "../services/guard-shift.service";
import catchAsync from "../utils/catchAsync";

const controller = {
  assignGuardToShift: catchAsync(async (req: Request, res: Response) => {
    const { guardId, shiftId } = req.body;

    const data = await guardShiftService.assignGuardToShift({
      companyId: req.auth!.id,
      guardId,
      shiftId,
    });

    return res.success({ data });
  }),

  removeGuardFromShift: catchAsync(async (req: Request, res: Response) => {
    const { guardId, shiftId } = req.body;

    const data = await guardShiftService.removeGuardFromShift({
      guardId,
      shiftId,
    });

    return res.success({ data });
  }),

  getGuardShifts: catchAsync(async (req: Request, res: Response) => {
    const guardId = Array.isArray(req.params.guardId)
      ? req.params.guardId[0]
      : req.params.guardId;

    const data = await guardShiftService.getGuardShifts({ guardId });

    return res.success({ data });
  }),

  getShiftGuards: catchAsync(async (req: Request, res: Response) => {
    const shiftId = Array.isArray(req.params.shiftId)
      ? req.params.shiftId[0]
      : req.params.shiftId;

    const data = await guardShiftService.getShiftGuards({ shiftId });

    return res.success({ data });
  }),

  updateAssignmentStatus: catchAsync(async (req: Request, res: Response) => {
    const { guardId, shiftId, status } = req.body;

    const data = await guardShiftService.updateAssignmentStatus({
      guardId,
      shiftId,
      status,
    });

    return res.success({ data });
  }),

  checkGuardAssignment: catchAsync(async (req: Request, res: Response) => {
    const { guardId, shiftId } = req.query;

    const data = await guardShiftService.isGuardAssignedToShift({
      guardId: guardId as string,
      shiftId: shiftId as string,
    });

    return res.success({ data });
  }),

  getAllAssignments: catchAsync(async (req: Request, res: Response) => {
    const { status } = req.query;
    const filters = status ? { status } : {};

    const data = await guardShiftService.getAllAssignments({ filters });

    return res.success({ data });
  }),
};

export default controller;
