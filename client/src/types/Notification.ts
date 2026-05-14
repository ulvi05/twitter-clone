export interface Notification {
  _id: string;
  type: "follow" | "like";
  isRead: boolean;
  from: {
    username: string;
    profileImage?: string;
  };
}
