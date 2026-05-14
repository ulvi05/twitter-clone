import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "./main";
import { selectUserData } from "@/store/features/userSlice";
import { getUserId } from "@/utils";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket>();
  const { user, loading } = useAppSelector(selectUserData);
  useEffect(() => {
    if (loading) return;
    const id = getUserId(user);
    const newSocket = io(import.meta.env.VITE_APP_API_BASE_URL, {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      newSocket.emit("register", id);
      setSocket(newSocket);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [loading, user]);
  useEffect(() => {
    return () => {
      socket?.disconnect();
    };
  }, [socket]);

  return socket;
};
