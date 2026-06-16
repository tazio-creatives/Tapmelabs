import api from "./api";

const commissionService = {
  summary:        ()     => api.get("/reseller/commission/summary"),
  ledger:         (p)    => api.get("/reseller/commission/ledger", { params: p }),
  requestPayout:  (data) => api.post("/reseller/commission/payout/request", data),
  payoutHistory:  ()     => api.get("/reseller/commission/payout/history"),
  dashboardStats: ()     => api.get("/reseller/profile/stats"),
};

export default commissionService;
