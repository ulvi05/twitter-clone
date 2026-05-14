const ProfileHeaderSkeleton = () => {
  return (
    <div className="flex flex-col w-full gap-2 p-4 my-2">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          <div className="flex flex-col w-full gap-1">
            <div className="w-12 h-4 rounded-full skeleton"></div>
            <div className="w-16 h-4 rounded-full skeleton"></div>
            <div className="relative w-full h-40 skeleton">
              <div className="absolute w-20 h-20 border rounded-full skeleton -bottom-10 left-3"></div>
            </div>
            <div className="w-24 h-6 mt-4 ml-auto rounded-full skeleton"></div>
            <div className="h-4 mt-4 rounded-full skeleton w-14"></div>
            <div className="w-20 h-4 rounded-full skeleton"></div>
            <div className="w-2/3 h-4 rounded-full skeleton"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileHeaderSkeleton;
