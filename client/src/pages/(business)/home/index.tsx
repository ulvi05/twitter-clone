import { useEffect, useState } from "react";

import Posts from "@/components/common/Posts";
import CreatePost from "./CreatePost";
import {
  getCurrentUserAsync,
  selectUserData,
} from "@/store/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/main";
import { toast } from "sonner";

const HomePage = () => {
  const [feedType, setFeedType] = useState<"forYou" | "following">("forYou");

  const dispatch = useAppDispatch();
  const { user, error } = useAppSelector(selectUserData);

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUserAsync());
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
        <div className="flex w-full border-b border-gray-700">
          <div
            className={
              "flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
            }
            onClick={() => setFeedType("forYou")}
          >
            For you
            {feedType === "forYou" && (
              <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
            )}
          </div>
          <div
            className="relative flex justify-center flex-1 p-3 transition duration-300 cursor-pointer hover:bg-secondary"
            onClick={() => setFeedType("following")}
          >
            Following
            {feedType === "following" && (
              <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
            )}
          </div>
        </div>

        <CreatePost />

        <Posts feedType={feedType} />
      </div>
    </>
  );
};
export default HomePage;
