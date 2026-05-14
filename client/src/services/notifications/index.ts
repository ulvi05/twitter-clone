import axiosInstance from "../axiosInstance";

const getAll = async () => {
  const response = await axiosInstance.get("/notifications");
  return response.data;
};

const deleteAll = async () => {
  const response = await axiosInstance.delete("/notifications");
  return response.data;
};

const notificationService = {
  getAll,
  deleteAll,
};
export default notificationService;
