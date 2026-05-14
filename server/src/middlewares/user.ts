import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { IUser } from "../types/user";

export const authorize =
  ({ isAdmin = false }) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    if (isAdmin && req.user.role !== "admin") {
      res.status(403).json({
        message: "Access denied",
      });
      return;
    }

    next();
  };

export const authenticate = (req: Request, res: Response, next: NextFunction) =>
  passport.authenticate(
    "local",
    (err: Error | null, user: IUser, info: { message: string }) => {
      if (err) {
        res.status(500).json({
          message: err.message,
        });
        return;
      }
      if (!user) {
        res.status(400).json({
          message: info.message,
        });
        return;
      }

      req.logIn(user, (err) => {
        if (err) {
          res.status(500).json({
            message: err.message,
          });
          return;
        }
        next();
      });
    }
  )(req, res, next);

export const googleAuthenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) =>
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
