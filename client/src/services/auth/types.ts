import { User } from "@/types/User";

export type LoginRequestPayloadType = {
  email: string;
  password: string;
};

export type RegisterRequestPayloadType = {
  email: string;
  username: string;
  fullName: string;
  password: string;
};

export type AuthResponseType = {
  message: string;
  user: User;
};
