import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, refreshToken } from "../utils/AuthService";

const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Attempt to refresh the token
        await refreshToken();

        // Fetch the current user
        const response = await getCurrentUser();
        console.log("AuthRoute - Current User:", response.roles);

        if (response && (response.roles.includes("NOT_VERIFIED") || response.roles.includes("NOT_VERIFY"))) {
          navigate("/account-activation"); // Redirect to account activation page
        }
      } catch (error) {
        console.error(
          "Error checking authentication or refreshing token:",
          error
        );
        navigate("/"); // Redirect to home if token is expired or invalid
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while checking auth
  }

  return <>{children}</>;
};

export default AuthRoute;
