import { useEffect, useState } from "react";
import usersService from "@/services/users";
import { User } from "@/types/User";

export default function CreateConversationModal({
  isOpen,
  onClose,
  onStartConversation,
  isPending,
}: {
  isOpen: boolean;
  onClose: () => void;
  onStartConversation: (userId: string) => void;
  isPending: boolean;
}) {
  const [followedUsers, setFollowedUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      try {
        const users = await usersService.getFollowedUsers();
        setFollowedUsers(users);
        setFilteredUsers(users);
      } catch (error) {
        console.error("Error fetching followed users:", error);
      }
    };

    if (isOpen) fetchFollowedUsers();
  }, [isOpen]);

  useEffect(() => {
    const results = followedUsers.filter((user) =>
      user.username.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredUsers(results);
  }, [search, followedUsers]);

  const handleStartConversation = (userId: string) => {
    onStartConversation(userId);
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="text-lg font-bold text-white">
          Start a New Conversation
        </h3>
        <p className="py-2 text-white">Select a user you follow.</p>

        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Search for users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full input input-bordered"
          />

          <div className="flex flex-col space-y-2 overflow-y-auto max-h-64">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-2 text-white border-b cursor-pointer hover:bg-gray-100 hover:text-black"
              >
                <div className="flex items-center space-x-2">
                  <img
                    src={user.profileImage || "/avatar-placeholder.png"}
                    alt={user.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{user.username}</span>
                </div>
                <button
                  className="text-white btn btn-primary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartConversation(user._id);
                  }}
                  disabled={isPending}
                >
                  {isPending ? "Starting..." : "Start"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-action">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
