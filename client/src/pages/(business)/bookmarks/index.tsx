import LoadingSpinner from "@/components/common/LoadingSpinner";
import PostOne from "@/components/common/PostOne";
import { QUERY_KEYS } from "@/constants/query-keys";
import postService from "@/services/posts";
import { PostType } from "@/types/Post";
import { useQuery } from "@tanstack/react-query";

const BookmarksPage = () => {
  const { data: bookmarkedPosts, isLoading } = useQuery<PostType[]>({
    queryKey: [QUERY_KEYS.BOOKMARKS],
    queryFn: postService.getAllBookmarks,
  });

  return (
    <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <p className="font-bold">Bookmarks</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="lg" />
        </div>
      ) : bookmarkedPosts?.length === 0 ? (
        <div className="p-4 font-bold text-center">
          You haven't bookmarked any posts yet. Tap the bookmark icon to save
          one! 📌
        </div>
      ) : (
        bookmarkedPosts?.map((post) => <PostOne key={post._id} post={post} />)
      )}
    </div>
  );
};

export default BookmarksPage;
