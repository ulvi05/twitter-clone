import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { geminiService } from "@/services/gemini";

import { RiGeminiFill } from "react-icons/ri";

interface Message {
  role: "user" | "model";
  content: string;
}

const GeminiPage = () => {
  const [history, setHistory] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const chatMutation = useMutation({
    mutationFn: async (data: { history: Message[]; prompt: string }) => {
      return await geminiService({
        history: data.history.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.content }],
        })),
        prompt: data.prompt,
      });
    },
    onSuccess: (data) => {
      const modelMessage: Message = {
        role: "model",
        content: data.response,
      };
      setHistory((prev) => [...prev, modelMessage]);
      setIsSending(false);
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      setIsSending(false);
    },
  });

  const handleSendMessage = async () => {
    if (!userInput.trim() || isSending) return;

    setIsSending(true);
    const newMessage: Message = { role: "user", content: userInput };
    setHistory((prev) => [...prev, newMessage]);
    setUserInput("");

    chatMutation.mutate({
      prompt: userInput,
      history: [...history, newMessage],
    });
  };

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollTo({
        top: wrapperRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [history]);

  const formatMessageContent = (content: string) => {
    return content
      .split("**")
      .map((part, index) =>
        index % 2 === 1 ? <b key={index}>{part}</b> : part
      );
  };

  return (
    <div className="flex flex-col items-center justify-between h-full p-4">
      <div className="flex flex-col w-full h-[90vh] overflow-hidden rounded-lg shadow-lg bg-base-100">
        <div className="flex items-center justify-center w-full gap-2 p-4 rounded-md bg-base-200">
          <RiGeminiFill className="text-4xl text-primary" />
          <h2 className="text-2xl font-bold">Gemini</h2>
        </div>
        <div ref={wrapperRef} className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {history.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 rounded-lg max-w-xs md:max-w-md lg:max-w-lg text-sm ${
                    message.role === "user"
                      ? "bg-primary text-white"
                      : "bg-base-300 text-base-content"
                  }`}
                >
                  {formatMessageContent(message.content)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 p-4 rounded-md bg-base-200">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your message..."
            className="flex-1 w-full rounded-md input input-bordered placeholder:text-xs md:placeholder:text-base placeholder:italic"
          />
          <button
            onClick={handleSendMessage}
            disabled={!userInput.trim() || isSending}
            className="text-white rounded-sm btn btn-primary whitespace-nowrap"
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiPage;
