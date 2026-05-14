import { User } from "./User";
import { Comment } from "./Comment";

export type PostType = {
  _id: string;
  text: string;
  img?: string;
  video?: string;
  likes: string[];
  comments: Comment[];
  user: User;
  createdAt: string;
  updatedAt: string;
  bookmarks: string[];
};
