import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";

import LoadingSpinner from "@/components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { QUERY_KEYS } from "@/constants/query-keys";
import notificationService from "@/services/notifications";
import { toast } from "sonner";
import { Notification } from "@/types/Notification";
import queryClient from "@/config/queryClient";

const NotificationPage = () => {
  const { data: notifications, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS],
    queryFn: notificationService.getAll,
  });

  const { mutate: deleteNotifications } = useMutation({
    mutationFn: notificationService.deleteAll,
    onSuccess: () => {
      toast.success("Notifications deleted successfully");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NOTIFICATIONS],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <p className="font-bold">Notifications</p>
          <div className="dropdown">
            <div tabIndex={0} role="button" className="m-1">
              <IoSettingsOutline className="w-4" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={() => deleteNotifications()}>
                  Delete all notifications
                </a>
              </li>
            </ul>
          </div>
        </div>
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {notifications?.length === 0 && (
          <div className="p-4 font-bold text-center">No notifications 🤔</div>
        )}
        {notifications?.map((notification: Notification) => (
          <div className="border-b border-gray-700" key={notification._id}>
            <div className="flex gap-2 p-4">
              {notification.type === "follow" && (
                <FaUser className="w-7 h-7 text-primary" />
              )}
              {notification.type === "like" && (
                <FaHeart className="text-red-500 w-7 h-7" />
              )}
              <Link to={`/profile/${notification.from?.username}`}>
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img
                      src={
                        notification.from?.profileImage ||
                        "/avatar-placeholder.png"
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-1">
                  <span className="font-bold">
                    @{notification.from?.username}
                  </span>{" "}
                  {notification.type === "follow"
                    ? "followed you"
                    : "liked your post"}
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default NotificationPage;
