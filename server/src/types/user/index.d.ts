import { ObjectId, Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  fullName: string;
  email: string;
  password?: string | null | undefined;
  role: "admin" | "user";
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  profileImage?: string;
  coverImage?: string;
  bio?: string;
  link?: string;
  resetPasswordToken?: string;
  resetPasswordTokenExpires?: Date;
  likedPosts: Types.ObjectId[];
  postCount?: number;
}
