import { createBrowserRouter } from "react-router-dom";
import { paths } from "@/constants/paths";
import RootLayout from "@/components/RootLayout";

import HomePage from "@/pages/(business)/home";
import ExplorePage from "@/pages/(business)/explore";
import ProfilePage from "@/pages/(business)/profile";
import LoginPage from "@/pages/(business)/auth/login/login";
import SignUpPage from "@/pages/(business)/auth/signup/signup";
import NotificationPage from "@/pages/(business)/notification";
import AuthGuard from "@/components/AuthLayout";
import ChatPage from "@/pages/(business)/chat";
import GeminiPage from "@/pages/(business)/gemini";
import SimpleLayout from "@/components/SimpleLayout";
import ForgotPassword from "@/pages/(business)/auth/forgot-password";
import ResetPassword from "@/pages/(business)/auth/reset-password";
import BookmarksPage from "@/pages/(business)/bookmarks";

const router = createBrowserRouter([
  {
    path: "",
    element: <AuthGuard />,
    children: [
      {
        path: "",
        element: <RootLayout />,
        children: [
          {
            path: paths.HOME,
            element: <HomePage />,
          },
          {
            path: paths.EXPLORE,
            element: <ExplorePage />,
          },
          {
            path: paths.PROFILE(),
            element: <ProfilePage />,
          },
          {
            path: paths.NOTIFICATION,
            element: <NotificationPage />,
          },
          {
            path: paths.BOOKMARKS,
            element: <BookmarksPage />,
          },
        ],
      },
      {
        path: "",
        element: <SimpleLayout />,
        children: [
          {
            path: paths.CHAT.VIEW,
            element: <ChatPage />,
          },
          {
            path: paths.CHAT.USER(),
            element: <ChatPage />,
          },
          {
            path: paths.GEMINI,
            element: <GeminiPage />,
          },
        ],
      },
    ],
  },
  {
    path: paths.LOGIN,
    element: <LoginPage />,
  },
  {
    path: paths.SIGNUP,
    element: <SignUpPage />,
  },
  {
    path: paths.FORGOT_PASSWORD,
    element: <ForgotPassword />,
  },
  {
    path: paths.RESET_PASSWORD(),
    element: <ResetPassword />,
  },
]);

export default router;
