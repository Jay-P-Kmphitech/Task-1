import mongoose, { Types } from "mongoose";
import GuardShift from "../models/guard-shift.model";
import { GuardShiftStatus } from "../schemas/guard-shift.schema";
import { StatementResultingChanges } from "node:sqlite";

const guardShiftRepo = {
  async assignGuardToShift(guardId: string, shiftId: string) {
    const guardShift = await GuardShift.create({
      guardId: new mongoose.Types.ObjectId(guardId),
      shiftId: new mongoose.Types.ObjectId(shiftId),
      status: GuardShiftStatus.Assigned,
      assignedAt: new Date(),
    });

    return guardShift;
  },

  async getAllShifts(guardId: string) {
    return GuardShift.find({
      guardId: new mongoose.Types.ObjectId(guardId),
    })
      .populate("shiftId")
      .sort({ assignedAt: -1 });
  },

  async removeGuardFromShift(guardId: string, shiftId: string) {
    const result = await GuardShift.deleteOne({
      guardId: new mongoose.Types.ObjectId(guardId),
      shiftId: new mongoose.Types.ObjectId(shiftId),
    });

    return result;
  },

  async getGuardShifts(guardId: string) {
    const guardShifts = await GuardShift.find({
      guardId: new mongoose.Types.ObjectId(guardId),
    })
      .populate("shiftId")
      .sort({ assignedAt: -1 });

    return guardShifts;
  },

  async getShiftGuards(shiftId: string) {
    const shiftGuards = await GuardShift.find({
      shiftId: new mongoose.Types.ObjectId(shiftId),
    })
      .populate("guardId")
      .sort({ assignedAt: -1 });

    return shiftGuards;
  },

  async updateAssignmentStatus(
    guardId: string,
    shiftId: string,
    status: string,
  ) {
    const guardShift = await GuardShift.findOneAndUpdate(
      {
        guardId: new mongoose.Types.ObjectId(guardId),
        shiftId: new mongoose.Types.ObjectId(shiftId),
      },
      { status },
      { new: true },
    );

    return guardShift;
  },

  async isGuardAssignedToShift(guardId: string, shiftId: string) {
    const assignment = await GuardShift.findOne({
      guardId: new mongoose.Types.ObjectId(guardId),
      shiftId: new mongoose.Types.ObjectId(shiftId),
    });

    return !!assignment;
  },

  async getAllAssignments(filters?: Record<string, any>) {
    const assignments = await GuardShift.find(filters || {})
      .populate("guardId")
      .populate("shiftId")
      .sort({ assignedAt: -1 });

    return assignments;
  },

  async getShiftsByDateRangeByGuardId(
    guardId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const shifts = await GuardShift.aggregate([
      { $match: { guardId: new Types.ObjectId(guardId) } },
      {
        $lookup: {
          from: "shifts",
          localField: "shiftId",
          foreignField: "_id",
          as: "shift",
        },
      },
      { $unwind: "$shift" },
      {
        $match: {
          $and: [
            { "shift.startDateTime": { $lte: endDate } },
            { "shift.endDateTime": { $gte: startDate } },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          shiftId: 1,
          guardId: 1,
          status: 1,
          assignedAt: 1,
          "shift.startDateTime": 1,
          "shift.endDateTime": 1,
        },
      },
    ]);

    return shifts;
  },
};

export default guardShiftRepo;
