import { Outlet } from "react-router-dom";
import Sidebar from "./common/Sidebar";
import DynamicTitle from "./DynamicHelmet";
import ScrollToTop from "./common/ScrollToTop";

const SimpleLayout = () => {
  return (
    <>
      <DynamicTitle />
      <ScrollToTop />
      <div className="flex w-full max-w-screen-xl gap-0 mx-auto md:gap-4">
        <div className="flex-shrink-0 w-20 md:w-64">
          <Sidebar />
        </div>

        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default SimpleLayout;
