import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

import { selectUserData, isAdminRole } from "../../features/user/userSlice";
import Navbar from "../../components/Navbar";
import AdditionalNavItems from "../../components/Admin/AdditionalNavItems";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const userData = useSelector(selectUserData);

  if (!userData || !isAdminRole(userData.role)) {
    return <Navigate to="/" replace state={{ redirected: true }} />;
  }

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={5000} />

      <div className={`flex flex-col h-screen`}>
        <Navbar additionalFields={<AdditionalNavItems />} />

        <main className="flex-1 overflow-auto bg-primary-light">{children}</main>
      </div>
    </>
  );
};

export default AdminRoute;
