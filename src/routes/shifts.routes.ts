import { Router } from "express";
import controller from "../controllers/shifts.controller";
import { authenticate } from "../middlewares/auth.middleware";

const ShiftsRouter = Router();

// Apply auth middleware to all routes
ShiftsRouter.use(authenticate);

// Create Shift
ShiftsRouter.post("/", controller.createShift);

// Get all shifts
ShiftsRouter.get("/", controller.getAllShifts);

// Get shifts by date range
ShiftsRouter.get("/date-range", controller.getShiftsByDateRange);

// Get shifts by location
ShiftsRouter.get("/location/:location", controller.getShiftsByLocation);

// Get shifts by company
ShiftsRouter.get("/company/:companyId", controller.getShiftsByCompany);

// Get shift by ID
ShiftsRouter.get("/:shiftId", controller.getShiftById);

// Update shift
ShiftsRouter.patch("/:shiftId", controller.updateShift);

// Delete shift
ShiftsRouter.delete("/:shiftId", controller.deleteShift);

export default ShiftsRouter;