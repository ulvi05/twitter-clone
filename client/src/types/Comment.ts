export type Comment = {
  _id: string;
  text: string;
  user: {
    _id: string | undefined;
    username: string;
    fullName: string;
    profileImage?: string;
  };
};
