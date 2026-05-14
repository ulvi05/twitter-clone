import { Request, Response } from "express";
import { hashPassword } from "../utils/bcrypt";
import { transporter } from "../utils/mail";
import crypto from "crypto";

import User from "../mongoose/schema/user";
import { IUser } from "../types/user";

const signup = async (req: Request, res: Response) => {
  try {
    const user = req.matchedData;

    if (!user.googleId) {
      user.googleId = "";
    }

    user.password = hashPassword(user.password);
    const userExist = await User.findOne({
      email: user.email,
    });
    if (userExist) {
      res.status(400).json({
        message:
          "An account with this email address already exists. Please use another email.",
      });
      return;
    }

    const newUser = new User(user);
    await newUser.save();

    const userObj: IUser = newUser.toObject();
    delete userObj.password;
    res.json({
      message: "Register successful",
      user: userObj,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const login = async (req: Request, res: Response) => {
  const user = { ...req.user };
  delete user.resetPasswordToken;
  delete user.resetPasswordTokenExpires;
  res.json({
    message: `Welcome back, ${req.user?.username}`,
    user: req.user,
  });
};

const googleAuth = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Google authentication failed" });
      return;
    }

    const googleUser = req.user as IUser;

    req.logIn(googleUser, (err) => {
      if (err) {
        console.error("Error in req.logIn:", err);
        res.status(500).json({ message: "Login session error" });
        return;
      }

      res.redirect("http://localhost:5173");
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const logout = async (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      res.status(500).json({
        message: "Something went wrong",
      });
      return;
    }

    res.json({
      message: "Logout successful",
    });
  });
};

const currentUser = (req: Request, res: Response) => {
  res.json({
    user: req.user,
  });
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({
        message: "User not found with this email",
      });
      return;
    }
    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordTokenExpires = new Date(Date.now() + 3600000);
    await user.save();
    transporter.sendMail({
      from: '"X Inc." <agazadeulvi03@gmail.com>',
      to: email,
      subject: "Reset your X password",
      html: `
<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e1e8ed; border-radius: 10px; background-color: #ffffff;">
      <h2 style="color: #14171a; text-align: center;">Reset your password</h2>
      <p style="font-size: 16px; color: #657786; text-align: center;">
        We received a request to reset your X password. If you made this request, click the button below:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="http://localhost:5173/reset-password/${token}" 
           style="display: inline-block; padding: 12px 20px; font-size: 16px; color: white; background-color: #000000; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Reset Password
        </a>
      </div>
      <p style="font-size: 14px; color: #657786; text-align: center;">
        If you didn’t request a password reset, you can ignore this email.
      </p>
      <hr style="border: 0; border-top: 1px solid #e1e8ed; margin: 20px 0;">
      <p style="font-size: 12px; color: #657786; text-align: center;">
        This email was sent to <strong>${email}</strong>.<br>
        X, Inc. 1355 Market Street, Suite 900, San Francisco, CA 94103
      </p>
    </div>
  `,
    });
    res.json({
      message: "Email sent",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400).json({ message: "Invalid or expired token" });
    return;
  }

  user.password = hashPassword(password);
  user.resetPasswordToken = "";
  user.resetPasswordTokenExpires = new Date(0);
  await user.save();

  res.json({
    message: "Password reset successful",
  });
};

export default {
  signup,
  login,
  googleAuth,
  logout,
  currentUser,
  forgotPassword,
  resetPassword,
};
