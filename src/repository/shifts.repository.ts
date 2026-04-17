import mongoose from "mongoose";
import Shift from "../models/shifts.model";

const shiftsRepo = {
  async createShift(arg: {
    companyId: string;
    shiftName: string;
    startDateTime: string;
    endDateTime: string;
    location: string;
    media?: string[];
  }) {
    const shift = await Shift.create({
      companyId: new mongoose.Types.ObjectId(arg.companyId),
      shiftName: arg.shiftName,
      startDateTime: arg.startDateTime,
      endDateTime: arg.endDateTime,
      location: arg.location,
      media: arg.media || null,
    });

    return shift;
  },

  async getShiftsByCompanyId(companyId: string, filters?: Record<string, any>) {
    const shifts = await Shift.find(
      { companyId: new mongoose.Types.ObjectId(companyId) },
      filters || {},
    ).sort({ createdAt: -1 });

    return shifts;
  },

  async getShiftsByCompany(companyId: string) {
    const shifts = await Shift.find({
      companyId: new mongoose.Types.ObjectId(companyId),
    })
      .populate("companyId", "name email")
      .sort({ startDateTime: 1 });

    return shifts;
  },

  async getShiftById(shiftId: string) {
    const shift = await Shift.findById(
      new mongoose.Types.ObjectId(shiftId),
    ).populate("companyId", "name email");

    return shift;
  },

  async updateShift(
    shiftId: string,
    updateData: Partial<{
      shiftName: string;
      startDateTime: string;
      endDateTime: string;
      location: string;
      media: string[];
    }>,
  ) {
    const shift = await Shift.findByIdAndUpdate(
      new mongoose.Types.ObjectId(shiftId),
      updateData,
      { new: true },
    ).populate("companyId", "name email");

    return shift;
  },

  async deleteShift(companyId: string, shiftId: string) {
    console.log(shiftId);
    console.log(companyId);
    const result = await Shift.deleteOne({
      _id: new mongoose.Types.ObjectId(shiftId),
      companyId: new mongoose.Types.ObjectId(companyId),
    });

    console.log(result);

    return result;
  },

  async getShiftsByDateRangeByCompanyId(
    companyId: string,
    startDate: string,
    endDate: string,
  ) {
    const filters: Record<string, unknown> = {
      startDateTime: { $gte: startDate },
      endDateTime: { $lte: endDate },
    };

    filters.companyId = new mongoose.Types.ObjectId(companyId);

    const shifts = await Shift.find(filters)
      .populate("companyId", "name email")
      .sort({ startDateTime: 1 });

    return shifts;
  },

  async getShiftsByLocation(location: string) {
    const shifts = await Shift.find({ location })
      .populate("companyId", "name email")
      .sort({ startDateTime: 1 });

    return shifts;
  },

  async checkMatch(authorId: string, shiftId: string): Promise<boolean> {
    const shift = await Shift.exists({
      _id: new mongoose.Types.ObjectId(shiftId),
      author: new mongoose.Types.ObjectId(authorId),
    });

    return shift ? true : false;
  },
};

export default shiftsRepo;
