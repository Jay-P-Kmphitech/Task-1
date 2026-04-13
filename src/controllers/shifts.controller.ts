import { Request, Response } from "express";
import shiftsService from "../services/shifts.service";
import catchAsync from "../utils/catchAsync";

const controller = {
    createShift: catchAsync(async (req: Request, res: Response) => {
        const { shiftName, startDateTime, endDateTime, location, media } = req.body;
        const companyId = (req.user as any)?._id;

        const data = await shiftsService.createShift({
            companyId,
            shiftName,
            startDateTime,
            endDateTime,
            location,
            media,
        });

        return res.success({ data });
    }),

    getAllShifts: catchAsync(async (req: Request, res: Response) => {
        const { status } = req.query;
        const filters = status ? { status } : {};

        const data = await shiftsService.getAllShifts({ filters });

        return res.success({ data });
    }),

    getShiftsByCompany: catchAsync(async (req: Request, res: Response) => {
        const companyId = Array.isArray(req.params.companyId)
            ? req.params.companyId[0]
            : req.params.companyId;

        const data = await shiftsService.getShiftsByCompany({ companyId });

        return res.success({ data });
    }),

    getShiftById: catchAsync(async (req: Request, res: Response) => {
        const shiftId = Array.isArray(req.params.shiftId)
            ? req.params.shiftId[0]
            : req.params.shiftId;

        const data = await shiftsService.getShiftById({ shiftId });

        return res.success({ data });
    }),

    updateShift: catchAsync(async (req: Request, res: Response) => {
        const shiftId = Array.isArray(req.params.shiftId)
            ? req.params.shiftId[0]
            : req.params.shiftId;
        const { shiftName, startDateTime, endDateTime, location, media } = req.body;

        const data = await shiftsService.updateShift({
            shiftId,
            shiftName,
            startDateTime,
            endDateTime,
            location,
            media,
        });

        return res.success({ data });
    }),

    deleteShift: catchAsync(async (req: Request, res: Response) => {
        const shiftId = Array.isArray(req.params.shiftId)
            ? req.params.shiftId[0]
            : req.params.shiftId;

        const data = await shiftsService.deleteShift({ shiftId });

        return res.success({ data });
    }),

    getShiftsByDateRange: catchAsync(async (req: Request, res: Response) => {
        const { startDate, endDate } = req.query;

        const data = await shiftsService.getShiftsByDateRange({
            startDate: startDate as string,
            endDate: endDate as string,
        });

        return res.success({ data });
    }),

    getShiftsByLocation: catchAsync(async (req: Request, res: Response) => {
        const location = Array.isArray(req.params.location)
            ? req.params.location[0]
            : req.params.location;

        const data = await shiftsService.getShiftsByLocation({ location });

        return res.success({ data });
    }),
};

export default controller;