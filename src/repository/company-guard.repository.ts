import { Types } from "mongoose";
import companyGuardModel from "../models/company-guard.model";

const companyGuardRepo = {
  async linkGuard(companyId: string, guardId: string) {
    const companyGuard = await companyGuardModel.create({
      companyId: new Types.ObjectId(companyId),
      guardId: new Types.ObjectId(guardId),
    });

    return companyGuard;
  },

  async unlinkGuard(companyId: string, guardId: string) {
    const companyGuard = await companyGuardModel.findOneAndDelete(
      {
        companyId: new Types.ObjectId(companyId),
        guardId: new Types.ObjectId(guardId),
      },
      { new: false },
    );

    return companyGuard;
  },

  async getGuards(companyId: string) {
    const result = await companyGuardModel.aggregate([
      // 1. Match documents where guardId exists / equals something
      {
        $match: {
          companyId: new Types.ObjectId(companyId), // or just guardId if already ObjectId
        },
      },

      // 2. Lookup company using companyId
      {
        $lookup: {
          from: "companies", // collection name in MongoDB
          localField: "guardId",
          foreignField: "_id",
          as: "guard-details",
        },
      },
      {
        $unwind: {
          path: "$company",
          preserveNullAndEmptyArrays: true,
        },
      },

      // 3. Lookup user using userId
      {
        $lookup: {
          from: "users", // collection name
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    return result;
  },

  async checkMatch(companyId: string, guardId: string): Promise<boolean> {
    const companyGuard = await companyGuardModel.exists({
      companyId: new Types.ObjectId(companyId),
      guardId: new Types.ObjectId(guardId),
    });

    return companyGuard ? true : false;
  },
};

export default companyGuardRepo;
