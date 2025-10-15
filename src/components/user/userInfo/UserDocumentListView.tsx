import React from "react";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import RecentItem from "../document/documentCard/RecentItem";
import type { Document } from "../../../models/document";

interface UserDocumentListViewProps {
  documents: Document[];
  loading?: boolean;
}

const UserDocumentListView: React.FC<UserDocumentListViewProps> = ({
  documents,
  loading,
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="space-y-2">
        {documents.map((doc) => (
          <div
            key={doc._id}
            className="cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => navigate(`/document-detail/${doc._id}`)}
          >
            <RecentItem
              title={doc.title}
              views={doc.view || 0}
              rating={0} // Default rating
              pages={doc.page || 0}
              date={new Date(doc.createdAt)}
              intensive={doc.intensive}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDocumentListView;
