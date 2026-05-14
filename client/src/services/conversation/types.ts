import { Conversation } from "@/types/Conversation";

export type GetConversationsType = {
  item: Conversation;
  message: string;
};

export type GetAllConversationsType = {
  conversations: Conversation[];
  message: string;
};
