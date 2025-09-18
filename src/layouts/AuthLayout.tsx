import React from "react";
import { BlankHeader } from "../components/common/header/BlankHeader";
import { Outlet, useLocation } from "react-router-dom";

const AuthLayout: React.FC = () => {
  const location = useLocation();

  const isAccountActivationPage = location.pathname === "/account-activation";
  const isRoleSelectionPage = location.pathname === "/role-selection";

  return (
    <div
      className="w-full h-full overflow-x-hidden"
      style={{
        backgroundColor: isRoleSelectionPage
          ? "transparent" // Role selection has its own gradient background
          : "var(--primary-background-color)",
      }}
    >
      <BlankHeader />
      <main className="w-full min-h-screen">
        <div
          className={`
          ${isAccountActivationPage ? "mt-24" : ""} 
          ${isRoleSelectionPage ? "mt-0" : ""}
        `}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
