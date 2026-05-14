import { useState, useEffect, FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import queryClient from "@/config/queryClient";
import { QUERY_KEYS } from "@/constants/query-keys";
import postService from "@/services/posts";

import { PostType } from "@/types/Post";
import { Comment } from "@/types/Comment";

import { useDialog, ModalTypeEnum } from "@/hooks/useDialog";
import LoadingSpinner from "./LoadingSpinner";
import { toast } from "sonner";
import { IoIosTrash } from "react-icons/io";
import { useAppSelector } from "@/hooks/main";
import { selectUserData } from "@/store/features/userSlice";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { AxiosError } from "axios";

const CommentModal = ({ post }: { post: PostType }) => {
  const { type, isOpen, postId, closeDialog } = useDialog();
  const { user } = useAppSelector(selectUserData);
  const [comment, setComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const modal = document.getElementById(
      `comments_modal${post._id}`
    ) as HTMLDialogElement;

    if (isOpen && type === ModalTypeEnum.COMMENT && postId === post._id) {
      modal?.showModal();
    } else {
      modal?.close();
    }
  }, [isOpen, type, postId, post._id]);

  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: postService.commentPost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.POSTS],
      });

      toast.success("Comment posted successfully");
      setComment("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { mutate: deleteComment, isPending: isDeleting } = useMutation({
    mutationFn: postService.deleteComments,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.POSTS],
      });
      toast.success("Comment deleted successfully");
    },
    onError: (error: AxiosError) => {
      toast.error(error.message || "Failed to delete comment");
    },
  });

  const handlePostComment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isCommenting) return;
    commentPost({ postId: post._id, text: comment });
  };

  const handleDeleteComment = (commentId: string) => {
    if (isDeleting) return;
    deleteComment({ postId: post._id, commentId });
  };

  const addEmoji = (emojiData: { emoji: string }) => {
    setComment((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <dialog
      id={`comments_modal${post._id}`}
      className="border-none outline-none modal"
    >
      <div className="p-4 border border-gray-600 modal-box rounded-xl">
        <h3 className="mb-4 text-lg font-bold">COMMENTS</h3>
        <div className="flex flex-col gap-3 overflow-auto max-h-60">
          {post.comments.length === 0 && (
            <p className="text-sm text-slate-500">
              No comments yet 🤔 Be the first one 😉
            </p>
          )}
          {post.comments.map((comment: Comment) => (
            <div key={comment._id} className="flex items-start gap-2">
              <div className="avatar">
                <div className="w-8 rounded-full">
                  <img
                    src={comment.user.profileImage || "/avatar-placeholder.png"}
                    alt="Avatar"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold">{comment.user.fullName}</span>
                <span className="text-sm text-gray-700">
                  @{comment.user.username}
                </span>
                <div className="text-sm">{comment.text}</div>
              </div>

              {user?._id === comment.user._id && (
                <div className="ml-auto">
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-red-500 outline-none hover:text-red-700"
                    disabled={isDeleting}
                  >
                    <IoIosTrash size={24} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <form
          onSubmit={handlePostComment}
          className="flex flex-col gap-2 pt-2 mt-4 border-t border-gray-600"
        >
          <textarea
            className="w-full p-2 border border-gray-800 rounded-lg resize-none textarea text-md focus:outline-none"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="relative flex items-center justify-end gap-2">
            <button
              type="button"
              className="px-2 py-1 rounded-lg"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
            >
              <MdOutlineEmojiEmotions />
            </button>
            {showEmojiPicker && (
              <div className="absolute z-50 bottom-10">
                <EmojiPicker
                  className="!h-48"
                  searchDisabled
                  previewConfig={{ showPreview: false }}
                  onEmojiClick={addEmoji}
                  theme={Theme.DARK}
                />
              </div>
            )}
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              disabled={isCommenting}
            >
              {isCommenting ? <LoadingSpinner size="md" /> : "Post"}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={closeDialog}>Close</button>
      </form>
    </dialog>
  );
};

export default CommentModal;
