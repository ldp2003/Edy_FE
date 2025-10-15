import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserInfoHeader from "../../../components/user/userInfo/UserInfoHeader";
import UserDocument from "../../../components/user/userInfo/UserDocument";
import { DocumentService } from "../../../utils/DocumentService";
import type { User } from "../../../models/user";
import type { Document } from "../../../models/document";
import { UserService } from "../../../utils/UserService";

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        // Fetch user info (replace with actual API call if available)
        const userInfo = await UserService.getUserById(userId);
        setUser(userInfo.user);

        // Fetch user documents
        const userDocs = await DocumentService.getDocumentByUser(userId, {
          limit: 5,
          order: -1,
        });
        setDocuments(userDocs.data.documents);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <UserInfoHeader user={user} />
      <div className="mt-6 mb-4 bg-white p-4 rounded-lg border border-[var(--border-color)] text-left text-[var(--primary-text-color)]">
        <h2 className="text-base font-bold mb-4">Tài liệu của người dùng</h2>
        <UserDocument documents={documents} />
      </div>
    </div>
  );
};

export default UserProfilePage;
