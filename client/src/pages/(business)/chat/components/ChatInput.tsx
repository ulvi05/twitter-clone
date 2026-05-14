import { FormEvent, RefObject, useState } from "react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import "@/styles/chatInput.css";

interface ChatInputProps {
  inputRef: RefObject<HTMLInputElement>;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export const ChatInput = ({ inputRef, handleSubmit }: ChatInputProps) => {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    if (inputRef.current) {
      inputRef.current.value += emojiObject.emoji;
    }
    setIsEmojiPickerOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row items-center w-full h-auto md:h-16 p-2 md:px-4 bg-[#202327] rounded-xl">
      <div className="flex-grow w-full md:w-auto md:ml-4">
        <form
          id="chat-form"
          onSubmit={handleSubmit}
          className="relative w-full"
        >
          <input
            ref={inputRef}
            type="text"
            className="flex w-full h-10 pl-4 border rounded-xl focus:outline-none focus:border-blue-300"
            placeholder="Type a message..."
          />
          <button
            type="button"
            onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
            className="absolute top-0 right-0 flex items-center justify-center w-12 h-full text-gray-400 hover:text-gray-500"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </button>
        </form>
      </div>
      <div className="w-full mt-2 md:mt-0 md:ml-4 md:w-auto">
        <button
          type="submit"
          form="chat-form"
          className="flex items-center justify-center w-full h-10 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-xl"
        >
          <span>Send</span>
          <span className="ml-2">
            <svg
              className="w-4 h-4 -mt-px transform rotate-45"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              ></path>
            </svg>
          </span>
        </button>
      </div>

      {isEmojiPickerOpen && (
        <div className="absolute z-50 bottom-16 right-4 md:bottom-20 md:right-8">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            previewConfig={{ showPreview: false }}
            theme={Theme.DARK}
          />
        </div>
      )}
    </div>
  );
};
