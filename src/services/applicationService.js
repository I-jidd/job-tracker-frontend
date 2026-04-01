import api from "./api";

export const getApplications = async () => {
  const response = await api.get("/api/v1/applications");
  return response.data;
};

export const createApplication = async (data) => {
  const response = await api.post("/api/v1/applications", data);
  return response.data;
};

export const updateStatus = async (IdleDeadline, status) => {
  const reposne = await api.put(`/api/v1/applicatoins/${id}/status`, null, {
    params: { status },
  });
  return;
};

export const deleteApplication = async (id) => {
  await api.delete(`/api/v1/applications/${id}`);
};
