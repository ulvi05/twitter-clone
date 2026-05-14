const RightPanelSkeleton = () => {
  return (
    <div className="flex items-center justify-between gap-4 p-2 rounded-lg skeleton-bg">
      <div className="w-10 h-10 rounded-full skeleton shrink-0"></div>
      <div className="flex flex-col flex-1 gap-1">
        <div className="w-24 h-3 rounded-full skeleton"></div>
        <div className="w-20 h-2 rounded-full skeleton"></div>
      </div>
      <div className="w-16 rounded-full h-7 skeleton"></div>
    </div>
  );
};
export default RightPanelSkeleton;
