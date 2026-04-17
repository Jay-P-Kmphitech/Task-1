import mongoose, { Types } from "mongoose";
import companyModel from "../models/company.model";
import guardModel from "../models/guard.model";
import userModel from "../models/user.model";

import { RegisterRequest as RegisterReqDto } from "../controllers/auth.controller";
import { Days, EmploymentType } from "../schemas/guard.schema";
import { User, UserRole } from "../schemas/user.schema";
import { passwordHashUtils } from "../utils/bcrypt.utils";

interface RegisterResponse {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  profile?: string;
  media?: [string];
  availability?: Array<Days>;
  maxHoursPerWeek?: number;
  employmentType?: EmploymentType;
}

const userRepo = {
  async createUser(
    arg: RegisterReqDto,
    session: mongoose.mongo.ClientSession,
  ): Promise<Record<string, unknown> | null> {
    // create password hash with generateHash method of bcrypt
    const passwordHash = await passwordHashUtils.generateHash(arg.password);

    // create the user instance
    let user: User | null = null;
    try {
      user = new userModel({
        email: arg.email,
        passwordHash,
        phone: arg.phone,
        role: arg.role,
        name: arg.name,
        profile: arg.profile,
      });

      await user.save({ session });
    } catch (error) {
      console.log(error);
      throw error;
    }

    switch (arg.role) {
      case UserRole.company: {
        // Convert possible media file input (e.g. Express.Multer.File[]) to string filenames if needed
        let media: string[] = [];

        if (Array.isArray(arg.media)) {
          media = (arg.media as any[])
            .map((m) => (typeof m === "string" ? m : (m.filename ?? "")))
            .filter(Boolean);
        }

        const company = new companyModel({
          userId: user._id,
          media,
        });

        await company.save({ session });

        const userObj: Object = user.toObject();
        const companyObj: Object = company.toObject();

        if ("_id" in companyObj) {
          delete companyObj["_id"];
        }

        if ("userId" in companyObj) {
          delete companyObj["userId"];
        }

        return {
          ...userObj,
          company: companyObj,
        };
      }
      case UserRole.guard: {
        const guard = new guardModel({
          userId: user._id,
          availability: arg.availability,
          employmentType: arg.employmentType,
          maxHoursPerWeek: arg.maxHoursPerWeek,
        });

        await guard.save({ session });

        const userObj: Object = user.toObject();
        const guardObj: Object = guard.toObject();

        if ("_id" in guardObj) {
          delete guardObj["_id"];
        }

        if ("userId" in guardObj) {
          delete guardObj["userId"];
        }

        return {
          ...userObj,
          ...guardObj,
        };
      }
      default:
        return user.toObject();
    }
  },

  async findByEmail(email: string): Promise<Object | null> {
    const user = await userModel.findOne({ email }).lean();
    if (!user) return null;

    let profile: unknown = null;

    switch (user.role) {
      case UserRole.company:
        profile = await companyModel.findById(user._id).lean();
        break;
      case UserRole.guard:
        profile = await guardModel.findById(user._id).lean();
        break;
      default:
        break;
    }

    let result: Object = Object.create(null);

    return Object.assign(result, user, profile);
  },
};

export default userRepo;
