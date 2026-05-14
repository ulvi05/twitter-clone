import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

export const RenderHeader = ({
  fullName,
  postCount,
}: {
  fullName: string;
  postCount: number;
}) => (
  <div className="flex items-center gap-10 px-4 py-2">
    <Link to="/">
      <FaArrowLeft className="w-4 h-4" />
    </Link>
    <div className="flex flex-col">
      <p className="text-lg font-bold">{fullName}</p>
      <span className="text-sm text-slate-500">{postCount} posts</span>
    </div>
  </div>
);
