import React from "react";
import { Spin } from "antd";
import DocumentCard from "../document/documentCard/DocumentCard";
import type { Document } from "../../../models/document";

interface PostGridViewProps {
  data: Document[];
  loading?: boolean;
}

const PostGridView: React.FC<PostGridViewProps> = ({ data, loading }) => {
  const displayData = loading ? [] : data;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {displayData.map((document) => {
          const isRejected = document.status === "REJECTED";
          const isDeleted = document.is_deleted;
          const isDisabled = isRejected || isDeleted;

          return (
            <div
              key={document._id}
              className={isDisabled ? "cursor-not-allowed opacity-60" : ""}
              onClick={(e) => {
                if (isDisabled) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              <DocumentCard
                document={document}
                navigationPath={
                  isDisabled
                    ? undefined
                    : `/personal-posts/document-detail/${document._id}`
                }
                disableClick={isDisabled}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostGridView;
