import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, refreshToken } from "../utils/AuthService";

const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await refreshToken();
        const response = await getCurrentUser();
        if (response && (response.roles.includes("NOT_VERIFIED") || response.roles.includes("NOT_VERIFY"))) {
          navigate("/account-activation");
        }
      } catch (error) {
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate]);

  // Không block render children
  return <>{children}</>;
};

export default AuthRoute;