import mongoose from "mongoose";
import { INotification } from "../../types/notifitacion";
const { Schema } = mongoose;

const notificationSchema = new Schema<INotification>(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["follow", "like"],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
notificationSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
  },
});

const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
export default Notification;
