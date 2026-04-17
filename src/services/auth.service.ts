import mongoose from "mongoose";
import { RegisterRequest } from "../controllers/auth.controller";
import userRepo from "../repository/user.repository";
import { AppError } from "../utils/appError";
import { passwordHashUtils } from "../utils/bcrypt.utils";
import { jwtUtils } from "../utils/jwt.utils";

const authService = {
  async register(arg: RegisterRequest) {
    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      var result = await userRepo.createUser(arg, session);

      await session.commitTransaction();

      const { password, passwordHash, ...payload } = result as any;

      const token = await jwtUtils.generateToken({
        id: payload._id,
        email: payload.email,
        role: payload.role,
      });

      return { token, ...payload };
    } catch (error) {
      await session.abortTransaction();

      throw error;
    } finally {
      await session.endSession();
    }
  },

  async login(arg: { email: string; password: string }): Promise<Object> {
    var result = await userRepo.findByEmail(arg.email);

    console.log("result", result);

    if (result !== null) {
      const isMatch = await passwordHashUtils.compareValue(
        arg.password,
        (result as any).passwordHash,
      );

      if (isMatch) {
        const token = jwtUtils.generateToken({
          id: (result as any)._id.toString(),
          email: (result as any).email,
          role: (result as any).role,
        });

        if ("passwordHash" in result) {
          delete result.passwordHash;
        }

        return { token, ...result };
      }
    }

    throw new AppError("Invalid email or password", 401);
  },
};

export default authService;
