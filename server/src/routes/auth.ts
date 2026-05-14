import express from "express";
import passport from "passport";
import authController from "../controllers/auth";
import {
  authenticate,
  authorize,
  googleAuthenticate,
} from "../middlewares/user";
import validateSchema from "../middlewares/validator";
import {
  forgotPasswordSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validation/auth";

const router = express.Router();

router.post("/login", authenticate, authController.login);

router.post("/signup", validateSchema(registerSchema), authController.signup);

router.post("/logout", authController.logout);

router.get("/current-user", authorize({}), authController.currentUser);

router.get("/google", googleAuthenticate);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  authController.googleAuth,
  (req, res) => {
    res.redirect("http://localhost:5173");
  }
);

router.post(
  "/forgot-password",
  validateSchema(forgotPasswordSchema),
  authController.forgotPassword
);

router.post(
  "/reset-password",
  validateSchema(resetPasswordSchema),
  authController.resetPassword
);

export default router;
