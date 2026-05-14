import mongoose from "mongoose";

export interface INotification extends Document {
  type: string;
  from: mongoose.Types.ObjectId;
  to: mongoose.Types.ObjectId;
  read: boolean;
  createdAt: Date;
}
