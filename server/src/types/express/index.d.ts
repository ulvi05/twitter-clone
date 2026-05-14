import { IUser } from "../user";

declare global {
  namespace Express {
    interface User extends IUser {}
    interface Request {
      matchedData: Record<string, any>;
    }
  }
}
