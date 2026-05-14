import { useMutation } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "./main";
import usersService from "@/services/users";
import {
  getCurrentUserAsync,
  selectUserData,
} from "@/store/features/userSlice";
import { QUERY_KEYS } from "@/constants/query-keys";
import { toast } from "sonner";
import queryClient from "@/config/queryClient";

const useFollow = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectUserData);

  const { mutate: follow, isPending } = useMutation({
    mutationFn: usersService.followUser,
    onSuccess: () => {
      dispatch(getCurrentUserAsync());

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SUGGESTED_USERS],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { follow, isPending, user };
};

export default useFollow;
