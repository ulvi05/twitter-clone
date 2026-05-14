import XSvg from "@/components/svgs/X";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications, IoSearch } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { IoMdBookmark, IoMdMail } from "react-icons/io";
import { RiGeminiFill } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from "@/hooks/main";
import { logoutAsync, selectUserData } from "@/store/features/userSlice";
import { toast } from "sonner";

const Sidebar = () => {
  const { user } = useAppSelector(selectUserData);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutAsync())
      .then((response) => {
        const message = response?.payload ?? "Logged out successfully!";
        toast.success(message);
        navigate("/login");
      })
      .catch((error) => {
        toast.error("Something went wrong! Please try again");
        console.log(error);
      });
  };

  return (
    <div className="flex-shrink-0 w-20 md:w-64">
      <div className="sticky top-0 left-0 flex flex-col h-screen pl-2 pr-2 border-r border-gray-700">
        <Link to="/" className="flex justify-center md:justify-start">
          <XSvg className="w-12 h-12 px-2 rounded-full fill-white hover:bg-stone-900" />
        </Link>

        <ul className="flex flex-col gap-3 mt-4">
          <li className="flex items-center justify-center cursor-pointer group md:justify-start">
            <Link
              to="/"
              className="flex items-center gap-3 py-2 pl-2 pr-4 transition-all duration-300 rounded-full cursor-pointer max-w-fit group-hover:bg-stone-900"
            >
              <MdHomeFilled className="w-8 h-8" />
              <span className="hidden text-xl md:block">Home</span>
            </Link>
          </li>
          <li className="flex items-center justify-center cursor-pointer group md:justify-start">
            <Link
              to="/explore"
              className="flex items-center gap-3 py-2 pl-2 pr-4 transition-all duration-300 rounded-full cursor-pointer max-w-fit group-hover:bg-stone-900"
            >
              <IoSearch className="w-6 h-6" />
              <span className="hidden text-xl md:block">Explore</span>
            </Link>
          </li>
          <li className="flex items-center justify-center cursor-pointer group md:justify-start">
            <Link
              to="/notifications"
              className="flex items-center gap-3 py-2 pl-2 pr-4 transition-all duration-300 rounded-full cursor-pointer max-w-fit group-hover:bg-stone-900"
            >
              <IoNotifications className="w-6 h-6" />
              <span className="hidden text-xl md:block">Notifications</span>
            </Link>
          </li>
          <li className="flex items-center justify-center cursor-pointer group md:justify-start">
            <Link
              to="/bookmarks"
              className="flex items-center gap-3 py-2 pl-2 pr-4 transition-all duration-300 rounded-full cursor-pointer max-w-fit group-hover:bg-stone-900"
            >
              <IoMdBookmark className="w-6 h-6" />
              <span className="hidden text-xl md:block">Bookmarks</span>
            </Link>
          </li>
          <li className="flex items-center justify-center cursor-pointer group md:justify-start">
            <Link
              to="/chat"
              className="flex items-center gap-3 py-2 pl-2 pr-4 transition-all duration-300 rounded-full cursor-pointer max-w-fit group-hover:bg-stone-900"
            >
              <IoMdMail className="w-6 h-6" />
              <span className="hidden text-xl md:block">Messages</span>
            </Link>
          </li>
          <li className="flex items-center justify-center cursor-pointer group md:justify-start">
            <Link
              to="/gemini"
              className="flex items-center gap-3 py-2 pl-2 pr-4 transition-all duration-300 rounded-full cursor-pointer max-w-fit group-hover:bg-stone-900"
            >
              <RiGeminiFill className="w-6 h-6" />
              <span className="hidden text-xl md:block">Gemini</span>
            </Link>
          </li>
          <li className="flex items-center justify-center cursor-pointer group md:justify-start">
            <Link
              to={`/profile/${user?.username}`}
              className="flex items-center gap-3 py-2 pl-2 pr-4 transition-all duration-300 rounded-full cursor-pointer max-w-fit group-hover:bg-stone-900"
            >
              <FaUser className="w-6 h-6" />
              <span className="hidden text-xl md:block">Profile</span>
            </Link>
          </li>
        </ul>

        {user && (
          <Link
            to={`/profile/${user.username}`}
            className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
          >
            <div className="hidden avatar md:inline-flex">
              <div className="w-8 rounded-full">
                <img src={user?.profileImage || "/avatar-placeholder.png"} />
              </div>
            </div>
            <div className="flex items-center justify-between flex-1">
              <div className="hidden md:block">
                <p className="w-20 text-sm font-bold text-white truncate">
                  {user?.fullName}
                </p>
                <p className="text-sm text-slate-500">@{user?.username}</p>
              </div>
              <BiLogOut
                className="w-5 h-5 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
