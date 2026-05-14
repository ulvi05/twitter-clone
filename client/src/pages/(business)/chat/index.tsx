import LoadingSpinner from "@/components/common/LoadingSpinner";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useAppSelector } from "@/hooks/main";
import { useSocket } from "@/hooks/use-socket";
import conversationService from "@/services/conversation";
import { selectUserData } from "@/store/features/userSlice";
import { cn } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { FormEvent, useEffect, useRef, useState } from "react";
import { CreateConversation } from "./CreateConversation";
import Sidebar from "./components/Sidebar";
import { useParams } from "react-router-dom";
import { ChatInput } from "./components/ChatInput";
import { IoCloseOutline } from "react-icons/io5";
import { FiSidebar } from "react-icons/fi";

export default function ChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { id } = useParams();

  const socket = useSocket();
  const { user } = useAppSelector(selectUserData);
  const [userId, setUserId] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const { data: conversationCreateData, isLoading: conversationCreateLoading } =
    useQuery({
      queryKey: [QUERY_KEYS.USER_CONVERSATION, { userId }],
      queryFn: () => conversationService.getByUserId({ userId }),
      enabled: !!userId,
    });

  const {
    data: chatData,
    isLoading: isChatLoading,
    status,
  } = useQuery({
    queryKey: [QUERY_KEYS.USER_CHAT, id],
    queryFn: () => conversationService.getById({ id: id! }),
    enabled: !!id,
  });
  const [messages, setMessages] = useState<
    { text: string; userId: string; createdAt: string; recipientId?: string }[]
  >([]);

  useEffect(() => {
    if (!socket) return;
    socket.on("message", (message) => {
      if (message.conversation !== window.location.pathname.split("/").pop())
        return;
      setMessages((prev) => [...prev, message]);
    });
  }, [socket]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!socket) return;
    e.preventDefault();
    const message = inputRef.current?.value.trim();
    const to =
      chatData?.data?.item?.recipientId._id !== user?._id
        ? chatData?.data?.item?.recipientId?._id
        : chatData?.data?.item?.userId?._id;

    const from = user?._id;

    if (!message || !to || !from) return;
    inputRef.current!.value = "";

    socket.emit("message", {
      message,
      to,
      from,
      conversation: chatData?.data?.item._id,
    });
    setMessages((prev) => [
      ...prev,
      {
        text: message,
        userId: from,
        recipientId: to,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  useEffect(() => {
    if (status === "success" && chatData) {
      const chatMessages = chatData?.data?.item.messages as unknown as {
        text: string;
        userId: string;
        createdAt: string;
      }[];

      setMessages(
        chatMessages.map((msg) => ({
          ...msg,
          createdAt: new Date(msg.createdAt).toISOString(),
        })),
      );
    }
  }, [chatData, status]);

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollTo({
        top: wrapperRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const getProfileImage = (messageUserId: string) => {
    if (messageUserId === user?._id) return user?.profileImage;

    return chatData?.data?.item?.recipientId?._id === messageUserId
      ? chatData?.data?.item?.recipientId?.profileImage
      : chatData?.data?.item?.userId?.profileImage;
  };

  return (
    <div className="relative flex min-h-screen antialiased text-gray-800">
      <button
        onClick={toggleSidebar}
        className={cn(
          "fixed z-50 p-2 text-white bg-black rounded-lg top-2 md:hidden",
          isSidebarOpen ? "left-0" : "left-[5rem]",
        )}
      >
        {isSidebarOpen ? (
          <IoCloseOutline className="w-5 h-5" />
        ) : (
          <FiSidebar className="w-5 h-5" />
        )}
      </button>
      <Sidebar
        isOpen={isSidebarOpen}
        onSelectConversation={(selectedUserId) => setUserId(selectedUserId)}
      />
      <div
        className={cn(
          "flex w-full h-full overflow-x-hidden",
          isSidebarOpen ? "overflow-hidden md:overflow-auto" : "overflow-auto",
        )}
      >
        {conversationCreateLoading || isChatLoading ? (
          <div className="flex items-center justify-center w-full h-full translate-y-40">
            <LoadingSpinner />
          </div>
        ) : !conversationCreateData && !id ? (
          <div className="flex items-center justify-center w-full h-screen">
            <CreateConversation />
          </div>
        ) : (
          <div className="flex flex-col flex-auto h-screen p-6 border-r border-gray-700">
            <div className="flex flex-col flex-1 h-full p-4 text-white bg-black rounded-2xl">
              {id ? (
                <>
                  <div
                    ref={wrapperRef}
                    className="flex flex-col h-full mb-4 overflow-x-auto"
                  >
                    <div className="flex flex-col h-full">
                      <div className="grid grid-cols-12 gap-y-2 max-h-[calc(100vh-200px)] md:max-h-[640px]">
                        {messages?.length > 0 ? (
                          messages.map((message, idx) => (
                            <MessageItem
                              key={idx}
                              message={message.text}
                              owner={message.userId === user?._id}
                              user={{
                                profileImage: getProfileImage(message.userId),
                              }}
                            />
                          ))
                        ) : (
                          <div className="flex items-center justify-center col-span-12 text-gray-400">
                            No messages
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChatInput inputRef={inputRef} handleSubmit={handleSubmit} />
                </>
              ) : (
                <div className="flex items-center justify-center w-full h-screen">
                  <CreateConversation />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const MessageItem = ({
  message,
  owner,
  user,
}: {
  message: string;
  owner: boolean;
  user: { profileImage?: string };
}) => {
  return (
    <div
      className={cn(
        "p-3 rounded-lg message-item",
        owner ? "col-start-6 col-end-13" : "col-start-1 col-end-8",
      )}
    >
      <div
        className={cn(
          "flex items-center",
          owner && "justify-start flex-row-reverse",
        )}
      >
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt="User Avatar"
            className="w-8 h-8 rounded-full md:w-10 md:h-10"
          />
        ) : (
          <img
            src={"/avatar-placeholder.png"}
            alt="User Avatar"
            className="w-8 h-8 rounded-full md:w-10 md:h-10"
          />
        )}
        <div
          className={cn(
            "relative px-4 py-2 text-sm shadow rounded-xl",
            owner ? "bg-blue-500 mr-3" : "bg-[#2f3336] ml-3",
            "max-w-[80%] md:max-w-[60%]",
          )}
        >
          <div>{message}</div>
        </div>
      </div>
    </div>
  );
};
