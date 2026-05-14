import { useEffect } from "react";
import {
  getCurrentUserAsync,
  selectUserData,
} from "@/store/features/userSlice";
import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "../common/LoadingSpinner";
import { paths } from "@/constants/paths";
import { useAppDispatch, useAppSelector } from "@/hooks/main";

const AuthGuard = () => {
  const { user, loading } = useAppSelector(selectUserData);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUserAsync());
    }
  }, [user, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={paths.LOGIN} />;
  }

  return <Outlet />;
};

export default AuthGuard;
