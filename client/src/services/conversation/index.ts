import axiosInstance from "../axiosInstance";
import { GetAllConversationsType, GetConversationsType } from "./types";

const getAll = async () => {
  return await axiosInstance.get<GetAllConversationsType>("/conversation");
};

const getByUserId = async ({ userId }: { userId: string }) => {
  const response = await axiosInstance.get<GetConversationsType>(
    `/conversation/user/${userId}`
  );
  return response.data;
};

const getById = async ({ id }: { id: string }) => {
  return await axiosInstance.get<GetConversationsType>(`/conversation/${id}`);
};

const create = async (data: { recipientId: string }) => {
  return await axiosInstance.post("/conversation", data);
};

const conversationService = {
  getAll,
  getByUserId,
  create,
  getById,
};

export default conversationService;
