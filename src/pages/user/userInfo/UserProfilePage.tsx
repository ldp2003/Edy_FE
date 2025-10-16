import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserInfoHeader from "../../../components/user/userInfo/UserInfoHeader";
import UserDocument from "../../../components/user/userInfo/UserDocument";
import type { User } from "../../../models/user";
import { UserService } from "../../../utils/UserService";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../contexts/UserContext";

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useContext(UserContext);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?._id === userId) {
      navigate("/personal-profile");
      return;
    }

    const fetchUserData = async () => {
      if (!userId) return;
      try {
        // Fetch user info
        const userInfo = await UserService.getUserById(userId);
        setUser(userInfo.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId, currentUser, navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <UserInfoHeader user={user} />
      <div className="mt-6">
        <UserDocument userId={userId!} />
      </div>
    </div>
  );
};

export default UserProfilePage;
