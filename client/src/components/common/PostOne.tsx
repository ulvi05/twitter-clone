import { selectUserData } from "@/store/features/userSlice";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { PostType } from "@/types/Post";
import { useAppSelector } from "@/hooks/main";
import postService from "@/services/posts";

import { useDialog, ModalTypeEnum } from "@/hooks/useDialog";
import CommentModal from "@/components/common/CommentModal";

import { FaRegComment, FaRegHeart, FaRegBookmark } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { IoIosMore } from "react-icons/io";
import { toast } from "sonner";
import LoadingSpinner from "./LoadingSpinner";
import { QUERY_KEYS } from "@/constants/query-keys";
import { formatPostDate } from "@/utils/date";
import queryClient from "@/config/queryClient";
import { FaBookmark } from "react-icons/fa6";

const PostOne = ({ post }: { post: PostType }) => {
  const { openDialog } = useDialog();
  const { user } = useAppSelector(selectUserData);

  const postOwner = post.user;
  const isLiked = post.likes.includes(user?._id ?? "");
  const isMyPost = user?._id === post.user._id;
  const formattedDate = formatPostDate(post.createdAt);

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: postService.deletePost,
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.POSTS],
      });
    },
  });

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: postService.likePost,
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(
        [QUERY_KEYS.POSTS],
        (oldData: PostType[] | undefined) => {
          if (!oldData) return [];
          return oldData.map((p) => {
            if (p._id === post._id) {
              return {
                ...p,
                likes: updatedLikes,
              };
            }
            return p;
          });
        }
      );
    },
  });

  const { mutate: toggleBookmark, isPending: isBookmarking } = useMutation({
    mutationFn: postService.toggleBookmarkPost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.POSTS],
      });
    },
  });

  const isBookmarked = post.bookmarks.includes(user?._id ?? "");

  const handleLikePost = () => {
    if (isLiking) return;
    likePost({ postId: post._id });
  };

  const handleDeletePost = () => {
    deletePost({ id: post._id });
  };

  const handleBookmarkPost = () => {
    if (isBookmarking) return;
    toggleBookmark(post._id);
  };

  return (
    <>
      <div className="flex items-start gap-2 p-4 border-b border-gray-700">
        <div className="avatar">
          <Link
            to={`/profile/${postOwner.username}`}
            className="w-8 h-8 overflow-hidden rounded-full"
          >
            <img
              src={postOwner.profileImage || "/avatar-placeholder.png"}
              alt="Profile"
            />
          </Link>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2">
            <Link to={`/profile/${postOwner.username}`} className="font-bold">
              {postOwner.fullName}
            </Link>
            <span className="flex gap-1 text-sm text-gray-700">
              <Link to={`/profile/${postOwner.username}`}>
                @{postOwner.username}
              </Link>
              <span>·</span>
              <span>{formattedDate}</span>
            </span>
            {isMyPost && (
              <div className="flex justify-end flex-1">
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="p-2 transition duration-200 rounded-full cursor-pointer hover:bg-blue-900 hover:bg-opacity-50"
                  >
                    {isDeleting ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <IoIosMore className="text-slate-500 hover:text-blue-400" />
                    )}
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-44"
                  >
                    <li>
                      <button onClick={handleDeletePost} disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete Post"}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 overflow-hidden">
            <span>{post.text}</span>
            {post.img && (
              <img
                src={post.img || "/avatars/user-3.png"}
                className="object-contain border border-gray-700 rounded-lg h-80"
                alt=""
              />
            )}
            {post.video && (
              <div className="flex justify-center mt-3">
                <video
                  className="object-contain border border-gray-700 rounded-lg h-80"
                  controls
                >
                  <source src={post.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-3">
            <div className="flex items-center justify-between w-2/3 gap-4">
              <div
                className="flex items-center gap-1 cursor-pointer group"
                onClick={() => openDialog(ModalTypeEnum.COMMENT, post._id)}
              >
                <div className="p-2 transition duration-200 rounded-full group-hover:bg-sky-900 group-hover:bg-opacity-50">
                  <FaRegComment className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
                </div>
                <span className="text-sm text-slate-500 group-hover:text-sky-400">
                  {post.comments.length}
                </span>
              </div>

              <div className="flex items-center gap-1 cursor-pointer group">
                <div className="p-2 transition duration-200 rounded-full group-hover:bg-green-900 group-hover:bg-opacity-50">
                  <BiRepost className="w-6 h-6 text-slate-500 group-hover:text-green-500" />
                </div>
                <span className="text-sm text-slate-500 group-hover:text-green-500">
                  0
                </span>
              </div>

              <div
                className="flex items-center gap-1 cursor-pointer group"
                onClick={handleLikePost}
              >
                <div className="p-2 transition duration-200 rounded-full group-hover:bg-pink-900 group-hover:bg-opacity-50">
                  {isLiking ? (
                    <LoadingSpinner size="xs" />
                  ) : (
                    <FaRegHeart
                      className={`w-4 h-4 transition duration-200 ${
                        isLiked ? "text-pink-500" : "text-slate-500"
                      } group-hover:text-pink-500`}
                    />
                  )}
                </div>
                <span
                  className={`text-sm transition duration-200 ${
                    isLiked ? "text-pink-500" : "text-slate-500"
                  } group-hover:text-pink-500`}
                >
                  {post.likes.length}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end w-1/3 gap-2 group">
              <div
                className="p-2 transition duration-200 rounded-full cursor-pointer group-hover:bg-blue-900 group-hover:bg-opacity-50"
                onClick={handleBookmarkPost}
              >
                {isBookmarked ? (
                  <FaBookmark className="w-4 h-4 text-blue-400" />
                ) : (
                  <FaRegBookmark className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CommentModal post={post} key={post._id} />
    </>
  );
};

export default PostOne;
