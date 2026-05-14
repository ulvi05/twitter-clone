import { useAppDispatch } from "./main";
import { getCurrentUserAsync } from "@/store/features/userSlice";
import queryClient from "@/config/queryClient";
import { QUERY_KEYS } from "@/constants/query-keys";
import usersService from "@/services/users";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const useUpdateUserProfile = () => {
  const dispatch = useAppDispatch();

  const { mutateAsync: updateProfile, isPending: updatingProfile } =
    useMutation({
      mutationFn: usersService.updateUserProfile,
      onSuccess: () => {
        toast.success("Profile updated successfully");
        dispatch(getCurrentUserAsync());
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.USER_PROFILE],
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  return { updateProfile, updatingProfile };
};

export default useUpdateUserProfile;
