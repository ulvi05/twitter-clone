import axiosInstance from "../axiosInstance";
import { GetAllUserResponse, updateUserProfileTypes } from "./types";

const getAll = async () => {
  const response = await axiosInstance.get<GetAllUserResponse>(
    "/users/suggested"
  );
  return response.data;
};

const UserProfile = async (username: string) => {
  const response = await axiosInstance.get(`/users/profile/${username}`);
  return response.data;
};

const updateUserProfile = async (data: updateUserProfileTypes) => {
  const response = await axiosInstance.put(`/users/update`, data);
  return response.data;
};

const followUser = async (userId: string) => {
  const response = await axiosInstance.post(`/users/follow/${userId}`);
  return response.data;
};
const getFollowedUsers = async () => {
  const response = await axiosInstance.get("/users/followed");
  return response.data;
};

const usersService = {
  getAll,
  UserProfile,
  followUser,
  updateUserProfile,
  getFollowedUsers,
};

export default usersService;
