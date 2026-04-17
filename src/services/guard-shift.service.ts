import companyGuardRepo from "../repository/company-guard.repository";
import guardShiftRepo from "../repository/guard-shift.repository";
import shiftsRepo from "../repository/shifts.repository";
import { AppError } from "../utils/appError";

const guardShiftService = {
  async assignGuardToShift(arg: {
    companyId: string;
    guardId: string;
    shiftId: string;
  }) {
    {
      const match = await shiftsRepo.checkMatch(arg.companyId, arg.shiftId);
      if (!match) {
        throw new AppError("Shift not authorized to assign", 403);
      }
    }

    {
      const match = await companyGuardRepo.checkMatch(
        arg.companyId,
        arg.guardId,
      );
      if (!match) {
        throw new AppError("Guard not authorized to assign shift", 403);
      }
    }

    const result = await guardShiftRepo.assignGuardToShift(
      arg.guardId,
      arg.shiftId,
    );

    return result;
  },

  async removeGuardFromShift(arg: { guardId: string; shiftId: string }) {
    const result = await guardShiftRepo.removeGuardFromShift(
      arg.guardId,
      arg.shiftId,
    );

    return result;
  },

  async getGuardShifts(arg: { guardId: string }) {
    const result = await guardShiftRepo.getGuardShifts(arg.guardId);

    return result;
  },

  async getShiftGuards(arg: { shiftId: string }) {
    const result = await guardShiftRepo.getShiftGuards(arg.shiftId);

    return result;
  },

  async updateAssignmentStatus(arg: {
    guardId: string;
    shiftId: string;
    status: string;
  }) {
    const result = await guardShiftRepo.updateAssignmentStatus(
      arg.guardId,
      arg.shiftId,
      arg.status,
    );

    return result;
  },

  async isGuardAssignedToShift(arg: { guardId: string; shiftId: string }) {
    const result = await guardShiftRepo.isGuardAssignedToShift(
      arg.guardId,
      arg.shiftId,
    );

    return result;
  },

  async getAllAssignments(arg: { filters?: Record<string, any> }) {
    const result = await guardShiftRepo.getAllAssignments(arg.filters);

    return result;
  },
};

export default guardShiftService;
