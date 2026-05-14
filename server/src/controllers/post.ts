import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

import User from "../mongoose/schema/user";
import Post from "../mongoose/schema/post";
import Notification from "../mongoose/schema/notification";

const createPost = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const userId = req.user?._id.toString();

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    let imgUrl: string | undefined;
    let videoUrl: string | undefined;

    if (!text && !req.files) {
      res.status(400).json({ message: "Post must have text or media" });
      return;
    }

    if (req.files && "img" in req.files) {
      const imgFile = (req.files as { img?: Express.Multer.File[] }).img?.[0];
      imgUrl = imgFile?.path;
    }

    if (req.files && "video" in req.files) {
      const videoFile = (req.files as { video?: Express.Multer.File[] })
        .video?.[0];
      videoUrl = videoFile?.path;
    }

    const newPost = new Post({
      user: userId,
      text,
      img: imgUrl,
      video: videoUrl,
    });

    await newPost.save();

    res.status(201).json(newPost);
    return;
  } catch (error) {
    console.log("Error createPost: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    if (!post.user || post.user.toString() !== req.user?._id.toString()) {
      res
        .status(401)
        .json({ message: "You are not authorized to delete this post" });
      return;
    }

    if (post.img) {
      const imgId = post.img?.split("/")?.pop()?.split(".")[0] || "";
      if (imgId) await cloudinary.uploader.destroy(imgId);
    }

    if (post.video) {
      const videoId = post.video?.split("/")?.pop()?.split(".")[0] || "";
      if (videoId)
        await cloudinary.uploader.destroy(videoId, {
          resource_type: "video",
        });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in deletePost controller: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const commentOnPost = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user?._id;

    if (!text) {
      res.status(400).json({ message: "Text field is required" });
      return;
    }
    const post = await Post.findById(postId);

    if (!post) {
      res.status(400).json({ message: "Post not found" });
      return;
    }

    const comment = { user: userId, text };
    post.comments.push(comment);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.log("Error in commentOnPost controller: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id: postId, commentId } = req.params;

    if (!req.user || !req.user._id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const commentIndex = post.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    if (post.comments[commentIndex].user.toString() !== userId.toString()) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    post.comments.splice(commentIndex, 1);

    await post.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error in deleteComment controller: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const likeUnlikePost = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id as mongoose.Types.ObjectId;

    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      //Unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      res.status(200).json(updatedLikes);
    } else {
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });

      await notification.save();

      const updatedLikes = post.likes;
      res.status(200).json(updatedLikes);
    }
  } catch (error) {
    console.log("Error in likeUnlikePost: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (posts.length === 0) {
      res.status(200).json([]);
      return;
    }
    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getAllPosts controller: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getLikedPosts = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not Found" });
      return;
    }
    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    res.status(200).json(likedPosts);
  } catch (error) {
    console.log("Error in getLikedPosts controller: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getFollowingPosts = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }
    const following = user.following;

    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(feedPosts);
  } catch (error) {
    console.log("Error in getFollowingPosts controller: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserPosts = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ message: "User Not Found" });
      return;
    }

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getUserPosts controller: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const bookmarkPost = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id as mongoose.Types.ObjectId;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const userBookmarked = post.bookmarks.includes(userId);

    if (userBookmarked) {
      await Post.updateOne({ _id: postId }, { $pull: { bookmarks: userId } });
      res.status(200).json({ message: "Bookmark removed" });
    } else {
      post.bookmarks.push(userId);
      await post.save();
      res.status(200).json({ message: "Post bookmarked" });
    }
  } catch (error) {
    console.error("Error in bookmarkPost: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getBookmarkedPosts = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const posts = await Post.find({ bookmarks: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getBookmarkedPosts: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default {
  createPost,
  deletePost,
  commentOnPost,
  deleteComment,
  likeUnlikePost,
  getAllPosts,
  getLikedPosts,
  getFollowingPosts,
  getUserPosts,
  bookmarkPost,
  getBookmarkedPosts,
};
