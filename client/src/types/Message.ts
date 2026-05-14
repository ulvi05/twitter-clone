import { Conversation } from "./Conversation";

export type Message = {
  _id: string;
  text: string;
  userId: string;
  recipientId: string;
  conversation: string | Conversation;
  createdAt: Date;
  updatedAt: Date;
};
