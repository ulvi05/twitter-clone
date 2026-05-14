import express from "express";
import geminiController from "../controllers/gemini";
import { authorize } from "../middlewares/user";

const router = express.Router();

router.post("/", authorize({}), geminiController.chatWithGemini);

export default router;
