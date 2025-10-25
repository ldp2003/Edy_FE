import React from "react";
import { Row, Col, Spin } from "antd";
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
      <Row gutter={[12, 12]} justify="start">
        {displayData.map((document) => {
          const isRejected = document.status === "REJECTED";
          return (
            <Col
              key={document._id}
              xs={24}
              sm={12}
              md={8}
              lg={6}
              xl={6}
              xxl={4}
            >
              <div
                className={isRejected ? "cursor-not-allowed opacity-60" : ""}
                onClick={(e) => {
                  if (isRejected) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              >
                <DocumentCard
                  document={document}
                  navigationPath={
                    isRejected
                      ? undefined
                      : `/personal-posts/document-detail/${document._id}`
                  }
                  disableClick={!!isRejected}
                />
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default PostGridView;
