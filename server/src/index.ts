import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import path from "path";

import { createServer } from "node:http";

import notificationRoutes from "./routes/notification";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import postRoutes from "./routes/posts";
import conversationRoutes from "./routes/conversation";
import geminiRoutes from "./routes/gemini";

import "./auth/local-strategy";
import "./auth/google";

import { connectSocket } from "./socket";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT;

const app = express();
const server = createServer(app);

connectSocket(server);

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
const allowedOrigins = [
  `${process.env.FE_BASE_URL}`,
  `${process.env.FE_PROD_URL}`,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(
  cors({
    origin: `${process.env.FE_BASE_URL}`,
    credentials: true,
  }),
);
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV !== "development" ? "none" : "lax",
    },
  }),
);
app.set("trust proxy", 1);
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/notifications", notificationRoutes);
app.use("/conversation", conversationRoutes);
app.use("/gemini", geminiRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

async function connectToDB() {
  await mongoose.connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitterclone.0tpqv.mongodb.net/?retryWrites=true&w=majority&appName=TwitterClone`,
  );
}
connectToDB()
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));
