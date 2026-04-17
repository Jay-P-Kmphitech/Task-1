import companyGuardRepo from "../repository/company-guard.repository";

const companyGuardService = {
  async linkGuard(companyId: string, guardId: string) {
    const result = await companyGuardRepo.linkGuard(companyId, guardId);

    return result;
  },

  async unlinkGuard(companyId: string, guardId: string) {
    const result = await companyGuardRepo.unlinkGuard(companyId, guardId);

    return result;
  },

  async getGuards(companyId: string) {
    const result = await companyGuardRepo.getGuards(companyId);

    return result;
  },
};

export default companyGuardService;
