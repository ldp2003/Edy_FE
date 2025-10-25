import React from "react";
import { BlankHeader } from "../components/common/header/BlankHeader";
import { Outlet, useLocation } from "react-router-dom";

const AuthLayout: React.FC = () => {
  const location = useLocation();

  const isAccountActivationPage = location.pathname === "/account-activation";
  const isRoleSelectionPage = location.pathname === "/role-selection";

  return (
    <div
      className="w-full h-full overflow-x-hidden flex flex-col"
      style={{
        backgroundColor: isRoleSelectionPage
          ? "transparent" // Role selection has its own gradient background
          : "var(--primary-background-color)",
      }}
    >
      <BlankHeader />
      <main className="flex-1 overflow-auto">
        <div
          className={`
          ${isAccountActivationPage ? "p-4 md:p-6" : ""} 
          ${isRoleSelectionPage ? "p-0" : ""}
          max-w-screen-xl mx-auto
        `}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
