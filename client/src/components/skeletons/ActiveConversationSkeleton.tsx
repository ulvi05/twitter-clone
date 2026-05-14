export const ActiveConversationSkeleton = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col mt-4 -mx-2 space-y-1 overflow-y-auto h-52">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-row items-center p-2 rounded-xl animate-pulse hover:bg-[#1D1F23]"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full"></div>
            <div className="w-24 h-4 ml-2 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
