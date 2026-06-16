import api from "./api";

const authService = {
  login:    (data)  => api.post("/reseller/auth/login", data),
  register: (data)  => api.post("/reseller/auth/register", data),
  logout:   ()      => api.post("/reseller/auth/logout"),
  me:       ()      => api.get("/reseller/auth/me"),
};

export default authService;
