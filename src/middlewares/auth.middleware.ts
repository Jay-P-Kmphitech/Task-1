import { NextFunction, Request, Response } from "express";
import { UserRole } from "../schemas/user.schema";
import catchAsync from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt.utils";

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      auth?: JWTPayload;
    }
  }
}

export const authenticate = () =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = jwtUtils.extractTokenFromHeader(authHeader);
    const decoded = jwtUtils.verifyToken(token);

    req.auth = decoded;
    next();
  });

export const authorizeRoles =
  (allowedRoles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth || !allowedRoles.includes(req.auth.role as UserRole)) {
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient permissions" });
    }

    next();
  };

export const unauthorizedRole =
  (disallowedRoles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (req.auth && disallowedRoles.includes(req.auth.role as UserRole)) {
      return res
        .status(403)
        .json({
          message: "Forbidden: role is not allowed to access this resource",
        });
    }

    next();
  };
