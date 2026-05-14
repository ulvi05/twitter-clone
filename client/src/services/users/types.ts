import { User } from "@/types/User";

export type GetAllUserResponse = {
  data: User[];
};

export type updateUserProfileTypes = {
  fullName?: string;
  username?: string;
  email?: string;
  bio?: string;
  link?: string;
  newPassword?: string;
  currentPassword?: string;
  profileImage?: string;
  coverImage?: string;
};
