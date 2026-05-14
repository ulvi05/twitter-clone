import { Message } from "react-hook-form";

export type Conversation = {
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
    profileImage?: string;
  };
  username: string;
  recipientId: {
    _id: string;
    username: string;
    email: string;
    profileImage?: string;
  };
  messages: Message[];
  unreadCount: number;
  createdAt: Date | string;
  updatedAt?: Date | string;
};
