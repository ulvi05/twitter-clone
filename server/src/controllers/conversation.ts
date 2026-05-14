import { Request, Response } from "express";
import Conversation from "../mongoose/schema/conversation";
import User from "../mongoose/schema/user";
import { IUser } from "../types/user";
import Message from "../mongoose/schema/message";

const getAll = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const conversations = await Conversation.find({
      $or: [{ userId: userId }, { recipientId: userId }],
    })
      .populate<{ userId: IUser }>("userId", "username profileImage")
      .populate<{ recipientId: IUser }>("recipientId", "username profileImage")
      .populate("messages");

    const formattedConversations = await Promise.all(
      conversations.map(async (conversation) => {
        const isUserSender =
          conversation.userId._id.toString() === userId?.toString();
        const otherUser: IUser = isUserSender
          ? (conversation.recipientId as IUser)
          : (conversation.userId as IUser);

        const unreadCount = await Message.countDocuments({
          conversation: conversation._id,
          recipientId: userId,
          isRead: false,
        });

        return {
          _id: conversation._id,
          recipient: {
            _id: otherUser._id,
            username: otherUser.username,
            profileImage: otherUser.profileImage || "",
          },
          messages: conversation.messages,
          unreadCount,
        };
      })
    );

    res.status(200).json({ conversations: formattedConversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getByUserId = async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const conversations = await Conversation.find({
      $or: [{ userId: req.user._id }, { recipientId: req.user._id }],
    })
      .populate("userId", "username email profileImage")
      .populate("recipientId", "username email profileImage")
      .populate("messages");

    if (!conversations || conversations.length === 0) {
      res.status(404).json({ message: "No conversations found" });
      return;
    }

    res.status(200).json({
      message: "Conversations fetched successfully",
      items: conversations,
    });
  } catch (error) {
    console.error("Error fetching user conversation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const conversation = await Conversation.findById(id)
      .populate("userId", "username email profileImage")
      .populate("recipientId", "username email profileImage")
      .populate({
        path: "messages",
        options: { sort: { createdAt: 1 } },
      });

    if (!conversation) {
      res.status(404).json({ message: "Conversation not found" });
      return;
    }

    await Message.updateMany(
      { conversation: id, recipientId: userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      message: "Conversation fetched successfully",
      item: conversation,
    });
  } catch (error) {
    console.error("Error fetching conversation by id:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const { recipientId } = req.body;

    if (!recipientId) {
      res.status(400).json({ message: "recipientId is required" });
      return;
    }

    if (req.user._id.toString() === recipientId) {
      res
        .status(400)
        .json({ message: "You cannot start a conversation with yourself" });
      return;
    }

    const existingConversation = await Conversation.findOne({
      $or: [
        { userId: req.user._id, recipientId },
        { userId: recipientId, recipientId: req.user._id },
      ],
    });

    if (existingConversation) {
      res.status(200).json({
        message: "Conversation already exists",
        item: existingConversation,
      });
      return;
    }

    const conversation = await Conversation.create({
      userId: req.user._id.toString(),
      recipientId: recipientId,
    });

    res.status(201).json({
      message: "Conversation created successfully",
      item: conversation,
    });
    return;
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export default {
  getAll,
  create,
  getByUserId,
  getById,
};
