import { useState } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { selectUserData } from "@/store/features/userSlice";
import conversationService from "@/services/conversation";
import { QUERY_KEYS } from "@/constants/query-keys";
import CreateConversationModal from "./components/CreateConversationModal";
import queryClient from "@/config/queryClient";

export const CreateConversation = () => {
  const { user } = useSelector(selectUserData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: conversationService.create,
    onSuccess: (newConversation) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER_CONVERSATION],
      });

      queryClient.setQueryData(
        [QUERY_KEYS.USER_CONVERSATION, { userId: user?._id }],
        (oldData: { item?: Array<typeof newConversation> } | undefined) => ({
          ...oldData,
          item: [...(oldData?.item ?? []), newConversation],
        })
      );
    },
  });

  function handleStartConversation(selectedUserId: string) {
    if (!user) return;

    mutate({
      recipientId: selectedUserId,
    });
  }

  return (
    <div className="p-4">
      <h1 className="mt-3 text-2xl font-semibold text-white">
        Start a conversation.
      </h1>
      <p className="my-3 text-primary">
        Select a user to start a conversation with our support.
      </p>

      <button
        type="button"
        className="w-full text-white btn btn-primary"
        onClick={() => setIsModalOpen(true)}
        disabled={isPending}
      >
        {isPending ? "Starting..." : "Start Conversation"}
      </button>

      <CreateConversationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStartConversation={handleStartConversation}
        isPending={isPending}
      />
    </div>
  );
};
