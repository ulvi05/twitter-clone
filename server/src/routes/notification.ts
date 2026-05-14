import express from "express";
import { authorize } from "../middlewares/user";
import notificationController from "../controllers/notification";

const router = express.Router();

router.get("/", authorize({}), notificationController.getNotifications);
router.delete("/", authorize({}), notificationController.deleteNotifications);
// router.delete("/:id", authorize({}), notificationController.deleteNotification);

export default router;
