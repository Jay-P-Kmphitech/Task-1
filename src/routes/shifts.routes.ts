import { Router } from "express";
import controller from "../controllers/shifts.controller";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import { UserRole } from "../schemas/user.schema";

const ShiftsRouter = Router();

ShiftsRouter.use(authenticate());

ShiftsRouter.route("/")
  .post(authorizeRoles([UserRole.company]), controller.createShift)
  .get(
    authorizeRoles([UserRole.company, UserRole.guard]),
    controller.getAllShifts,
  );

// Get shifts by date range
ShiftsRouter.get(
  "/date-range",
  authorizeRoles([UserRole.company, UserRole.guard]),
  controller.getShiftsByDateRange,
);

// Get shifts by location
ShiftsRouter.get("/location/:location", controller.getShiftsByLocation);

// Get shifts by company
ShiftsRouter.get("/company/:companyId", controller.getShiftsByCompany);

// Get shift by ID
ShiftsRouter.route("/:shiftId")
  .get(
    authorizeRoles([UserRole.company, UserRole.guard]),
    controller.getShiftById,
  )
  .patch(authorizeRoles([UserRole.company]), controller.updateShift)
  .delete(authorizeRoles([UserRole.company]), controller.deleteShift);

export default ShiftsRouter;
