import { DefaultEventsMap, Socket } from "socket.io";
import Message from "../mongoose/schema/message";
import User from "../mongoose/schema/user";
import Conversation from "../mongoose/schema/conversation";

const socketUsers: Record<string, string> = {};
export function SocketHandlers(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
  socket.on("register", (userId: string) => {
    onRegister(userId, socket);
  });

  socket.on("message", (data: { message: string; to: string; from: string }) =>
    onMessage(data, socket)
  );

  socket.on("disconnect", () => onDisconnect(socket));
}

function onRegister(userId: string, socket: Socket) {
  socketUsers[userId] = socket.id;
}

async function onMessage(
  { message, to, from }: { message: string; to: string; from: string },
  socket: Socket
) {
  try {
    if (from === to) {
      return socket.emit("error", "You cannot message yourself.");
    }

    const sender = await User.findById(from).select("fullName");
    if (!sender) return socket.emit("error", "User not found");

    let conversation = await Conversation.findOne({
      $or: [
        { userId: from, recipientId: to },
        { userId: to, recipientId: from },
      ],
    });

    if (!conversation) {
      conversation = await Conversation.create({
        userId: from,
        recipientId: to,
        messages: [],
      });
    }

    const recipient = await User.findById(to).select("username");
    if (!recipient) return socket.emit("error", "Recipient not found");

    const messageItem = await Message.create({
      text: message,
      userId: from,
      recipientId: to,
      recipientName: recipient.username,
      username: sender.fullName,
      conversation: conversation._id,
      isRead: false,
    });

    conversation.messages.push(messageItem._id);
    await conversation.save();

    const socketId = socketUsers[to];

    if (socketId) {
      socket.to(socketId).emit("message", messageItem);
      const unreadCount = await Message.countDocuments({
        recipientId: to,
        isRead: false,
      });
      socket.to(socketId).emit("unreadMessages", { unreadCount });
    }
  } catch (error) {
    console.error("⚠️ An error occurred:", error);
  }
}

function onDisconnect(socket: Socket) {
  Object.entries(socketUsers).forEach((item) => {
    if (item[1] === socket.id) {
      delete socketUsers[item[0]];
    }
  });
}
