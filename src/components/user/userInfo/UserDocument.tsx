import React from "react";
import { useNavigate } from "react-router-dom";
import RecentItem from "../document/documentCard/RecentItem";
import type { Document } from "../../../models/document";

interface UserDocumentProps {
  documents: Document[];
}

const UserDocument: React.FC<UserDocumentProps> = ({ documents }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div
          key={doc._id}
          onClick={() => navigate(`/personal-posts/document-detail/${doc._id}`)}
          style={{ cursor: "pointer" }}
        >
          <RecentItem
            title={doc.title}
            views={doc.view || 0}
            pages={doc.page || 0}
            date={new Date(doc.createdAt).toLocaleDateString("vi-VN")}
            rating={0} // Default value for rating
          />
        </div>
      ))}
    </div>
  );
};

export default UserDocument;
