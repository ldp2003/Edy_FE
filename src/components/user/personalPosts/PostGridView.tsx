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
      <Row gutter={[16, 16]} justify="start">
        {displayData.map((document) => {
          const isRejected = document.status === "REJECTED";
          const isRequestedEdit =
            document.status === "REQUESTED_EDIT" ||
            document.status === "PENDING_EDIT";
          const hasRejectionMessage = document.content_rejection?.message;
          const showRejectionReason =
            (isRejected || isRequestedEdit) && hasRejectionMessage;
          return (
            <Col
              key={document._id}
              xs={24}
              sm={12}
              md={12}
              lg={8}
              xl={4}
              xxl={4}
              style={{ maxWidth: "20%", flex: "0 0 20%" }}
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
                  title={
                    showRejectionReason ? (
                      <div>
                        <div
                          className={
                            isRejected ? "line-through text-gray-400" : ""
                          }
                          style={{ fontSize: "12px" }}
                        >
                          {document.title}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: isRejected ? "#e74c3c" : "#f39c12",
                            fontStyle: "italic",
                            marginTop: "4px",
                          }}
                        >
                          {isRejected ? "Lý do từ chối" : "Yêu cầu chỉnh sửa"}:{" "}
                          {document.content_rejection?.message}
                        </div>
                      </div>
                    ) : (
                      document.title
                    )
                  }
                  description={`${document.view || 0} lượt xem • ${
                    document.comment_count || 0
                  } bình luận`}
                  imageUrl={document.cover_page}
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
