import axiosInstance from "../axiosInstance";

const getPosts = async (
  feedType: "forYou" | "following" | "likes" | "posts",
  userId?: string,
  username?: string
) => {
  let endpoint = "";

  if (feedType === "following") {
    endpoint = "/posts/following";
  } else if (feedType === "forYou") {
    endpoint = "/posts/all";
  } else if (feedType === "likes" && userId) {
    endpoint = `/posts/likes/${userId}`;
  } else if (feedType === "posts" && username) {
    endpoint = `/posts/user/${username}`;
  } else {
    throw new Error("Missing userId or username for the specified feed type");
  }

  const { data } = await axiosInstance.get(endpoint);
  return data;
};

const create = async (data: { text: string; media?: File | null }) => {
  const formData = new FormData();
  formData.append("text", data.text);

  if (data.media) {
    if (data.media.type.startsWith("image")) {
      formData.append("img", data.media);
    } else if (data.media.type.startsWith("video")) {
      formData.append("video", data.media);
    }
  }

  const response = await axiosInstance.post("/posts/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

const likePost = async (data: { postId: string }) => {
  const response = await axiosInstance.post(`/posts/like/${data.postId}`);
  return response.data;
};

const commentPost = async (data: { postId: string; text: string }) => {
  const response = await axiosInstance.post(`/posts/comment/${data.postId}`, {
    text: data.text,
  });
  return response.data;
};
const deleteComments = async (data: { postId: string; commentId: string }) => {
  const response = await axiosInstance.delete(
    `/posts/${data.postId}/comment/${data.commentId}`
  );
  return response.data;
};

const deletePost = async (data: { id: string }) => {
  return await axiosInstance.delete(`/posts/${data.id}`);
};

const toggleBookmarkPost = async (postId: string) => {
  const response = await axiosInstance.post(`/posts/${postId}/bookmark`);
  return response.data;
};

const getAllBookmarks = async () => {
  const response = await axiosInstance.get("/posts/bookmarks");
  return response.data;
};

const postService = {
  getPosts,
  create,
  likePost,
  commentPost,
  deleteComments,
  deletePost,
  toggleBookmarkPost,
  getAllBookmarks,
};

export default postService;
