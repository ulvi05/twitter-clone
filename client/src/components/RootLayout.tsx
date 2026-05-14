import { Outlet } from "react-router-dom";
import Sidebar from "./common/Sidebar";
import RightPanel from "./common/RightPanel";
import DynamicTitle from "./DynamicHelmet";
import ScrollToTop from "./common/ScrollToTop";

const RootLayout = () => {
  return (
    <>
      <DynamicTitle />
      <ScrollToTop />
      <div className="flex mx-auto max-w-7xl">
        <Sidebar />

        <Outlet />

        <RightPanel />
      </div>
    </>
  );
};

export default RootLayout;
