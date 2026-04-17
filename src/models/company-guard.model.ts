import { model } from "mongoose";
import companyGuardSchema, { CompanyGuard } from "../schemas/comany-guard.schema";

export default model<CompanyGuard>("company-guard", companyGuardSchema);