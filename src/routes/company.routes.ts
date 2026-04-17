import { Router } from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";
import controller from "../controllers/company.controller";
import { UserRole } from "../schemas/user.schema";

const CompanyRouter = Router();

CompanyRouter.use(authenticate());

CompanyRouter.post(
  "/link-guard",
  authorizeRoles([UserRole.company]),
  controller.linkGuard,
);

CompanyRouter.post(
  "/unlink-guard",
  authorizeRoles([UserRole.company]),
  controller.unlinkGuard,
);

CompanyRouter.get(
  "/guards",
  authorizeRoles([UserRole.company]),
  controller.getGuards,
);

export default CompanyRouter;
