import { JWTPayload } from "../middlewares/auth.middleware";
import guardShiftRepo from "../repository/guard-shift.repository";
import shiftsRepo from "../repository/shifts.repository";
import { UserRole } from "../schemas/user.schema";
import { AppError } from "../utils/appError";

const shiftsService = {
  async createShift(arg: {
    companyId: string;
    shiftName: string;
    startDateTime: string;
    endDateTime: string;
    location: string;
    media?: string[];
  }) {
    // Validate date and time
    const startTime = new Date(arg.startDateTime);
    const endTime = new Date(arg.endDateTime);

    if (endTime <= startTime) {
      throw new AppError("End time must be after start time", 400);
    }

    const result = await shiftsRepo.createShift(arg);
    return result;
  },

  async getAllShifts(arg: {
    payload: JWTPayload;
    filters?: Record<string, any>;
  }) {
    if (UserRole.guard === arg.payload.role) {
      return await guardShiftRepo.getAllShifts(arg.payload.id);
    } else if (UserRole.company === arg.payload.role) {
      return await shiftsRepo.getShiftsByCompanyId(
        arg.payload.id,
        arg?.filters,
      );
    } else {
    }
  },

  async getShiftsByCompany(arg: { companyId: string }) {
    const result = await shiftsRepo.getShiftsByCompany(arg.companyId);
    return result;
  },

  async getShiftById(arg: { shiftId: string }) {
    const result = await shiftsRepo.getShiftById(arg.shiftId);

    if (!result) {
      throw new AppError("Shift not found", 404);
    }

    return result;
  },

  async updateShift(arg: {
    shiftId: string;
    shiftName?: string;
    startDateTime?: string;
    endDateTime?: string;
    location?: string;
    media?: string[];
  }) {
    // Validate date and time if both are provided
    if (arg.startDateTime && arg.endDateTime) {
      const startTime = new Date(arg.startDateTime);
      const endTime = new Date(arg.endDateTime);

      if (endTime <= startTime) {
        throw new AppError("End time must be after start time", 400);
      }
    }

    const updateData: Partial<{
      shiftName: string;
      startDateTime: string;
      endDateTime: string;
      location: string;
      media: string[];
    }> = {};

    if (arg.shiftName) updateData.shiftName = arg.shiftName;
    if (arg.startDateTime) updateData.startDateTime = arg.startDateTime;
    if (arg.endDateTime) updateData.endDateTime = arg.endDateTime;
    if (arg.location) updateData.location = arg.location;
    if (arg.media) updateData.media = arg.media;

    const result = await shiftsRepo.updateShift(arg.shiftId, updateData);

    if (!result) {
      throw new AppError("Shift not found", 404);
    }

    return result;
  },

  async deleteShift(arg: { companyId: string; shiftId: string }) {
    const result = await shiftsRepo.deleteShift(arg.companyId, arg.shiftId);

    if (result.deletedCount === 0) {
      throw new AppError("Shift not found", 404);
    }

    return result;
  },

  async getShiftsByDateRange(arg: {
    payload: JWTPayload;
    startDate: Date;
    endDate: Date;
  }) {
    const startTime = new Date(arg.startDate);
    const endTime = new Date(arg.endDate);

    if (endTime <= startTime) {
      throw new AppError("End date must be after start date", 400);
    }

    let result: any;

    if (arg.payload.role === UserRole.guard) {
      result = await guardShiftRepo.getShiftsByDateRangeByGuardId(
        arg.payload.id,
        arg.startDate,
        arg.endDate,
      );
    } else if (arg.payload.role === UserRole.company) {
      // result = await shiftsRepo.getShiftsByDateRangeByCompanyId(
      //   arg.payload.id,
      //   arg.startDate,
      //   arg.endDate,
      // );
      throw Error("Not implemented");
    }

    return result;
  },

  async getShiftsByLocation(arg: { location: string }) {
    const result = await shiftsRepo.getShiftsByLocation(arg.location);
    return result;
  },
};

export default shiftsService;
