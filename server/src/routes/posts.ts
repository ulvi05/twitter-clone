import express from "express";
import { authorize } from "../middlewares/user";
import postController from "../controllers/post";
import upload from "../middlewares/multer";

const router = express.Router();

router.get("/all", authorize({}), postController.getAllPosts);
router.get("/following", authorize({}), postController.getFollowingPosts);
router.get("/likes/:id", authorize({}), postController.getLikedPosts);
router.get("/user/:username", authorize({}), postController.getUserPosts);
router.post("/create", authorize({}), upload, postController.createPost);
router.post("/like/:id", authorize({}), postController.likeUnlikePost);
router.post("/comment/:id", authorize({}), postController.commentOnPost);
router.post("/:id/bookmark", authorize({}), postController.bookmarkPost);
router.get("/bookmarks", authorize({}), postController.getBookmarkedPosts);
router.delete(
  "/:id/comment/:commentId",
  authorize({}),
  postController.deleteComment
);
router.delete("/:id", authorize({}), postController.deletePost);

export default router;
