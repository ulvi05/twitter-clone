import { Helmet } from "react-helmet-async";
import { useLocation, useParams } from "react-router-dom";
import { paths } from "@/constants/paths";

const pageTitles: Record<string, string> = {
  [paths.HOME]: "Home",
  [paths.EXPLORE]: "Explore",
  [paths.PROFILE()]: "Profile",
  [paths.NOTIFICATION]: "Notifications",
  [paths.BOOKMARKS]: "Bookmarks",
  [paths.SUBSCRIBE]: "Premium",
  [paths.CHAT.VIEW]: "Chat",
  [paths.GEMINI]: "Gemini",
  [paths.LOGIN]: "Login",
  [paths.SIGNUP]: "Sign Up",
  [paths.FORGOT_PASSWORD]: "Forgot Password",
};

export default function DynamicTitle() {
  const location = useLocation();
  const params = useParams();

  let title = pageTitles[location.pathname] || "X";

  if (location.pathname.startsWith("/profile")) {
    title = `${params.username} (@${params.username})`;
  }
  return (
    <Helmet>
      <title>{title} / X</title>
    </Helmet>
  );
}
