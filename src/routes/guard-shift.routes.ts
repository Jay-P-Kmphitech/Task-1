import { Router } from "express";
import controller from "../controllers/guard-shift.controller";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { UserRole } from "../schemas/user.schema";

const guardShiftRouter = Router();

guardShiftRouter.use(authenticate());

guardShiftRouter.post(
  "/assign",
  authorizeRoles([UserRole.company]),
  controller.assignGuardToShift,
);

guardShiftRouter.delete(
  "/remove",
  authorizeRoles([UserRole.company]),
  controller.removeGuardFromShift,
);

guardShiftRouter.get(
  "/guard/:guardId",
  authorizeRoles([UserRole.company]),
  controller.getGuardShifts,
);

guardShiftRouter.get(
  "/shift/:shiftId",
  authorizeRoles([UserRole.company, UserRole.guard]),
  controller.getShiftGuards,
);

guardShiftRouter.patch("/status", controller.updateAssignmentStatus);

guardShiftRouter.get("/check", controller.checkGuardAssignment);

guardShiftRouter.get("/all", controller.getAllAssignments);

export default guardShiftRouter;
