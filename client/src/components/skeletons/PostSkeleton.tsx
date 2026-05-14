const PostSkeleton = () => {
  return (
    <div className="flex flex-col w-full gap-4 p-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full skeleton shrink-0"></div>
        <div className="flex flex-col gap-2">
          <div className="w-12 h-2 rounded-full skeleton"></div>
          <div className="w-24 h-2 rounded-full skeleton"></div>
        </div>
      </div>
      <div className="w-full h-40 skeleton"></div>
    </div>
  );
};
export default PostSkeleton;
