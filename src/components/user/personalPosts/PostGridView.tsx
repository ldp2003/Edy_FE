import React from "react";
import { Row, Col, Spin } from "antd";
import DocumentCard from "../document/documentCard/DocumentCard";
import type { Document } from "../../../models/document";
interface Post {
  key: string;
  index: number;
  title: string;
  views: number;
  comments: number;
  rating: string;
  status: string;
  mode: string;
  public_mode: string;
  url: string;
  cover_page?: string;
  createdAt: string;
  content_rejection?: {
    message: string;
  };
}

interface PostGridViewProps {
  data: Post[];
  loading?: boolean;
}

const PostGridView: React.FC<PostGridViewProps> = ({ data, loading }) => {
  const displayData = loading ? [] : data;

  // Transform Post to Document format for DocumentCard
  const transformPostToDocument = (post: Post): Document => {
    return {
      _id: post.key,
      title: post.title,
      url: post.url,
      cover_page: post.cover_page,
      view: post.views,
      comment_count: post.comments,
      createdAt: post.createdAt,
      status: post.status as
        | "PENDING"
        | "APPROVED"
        | "PENDING_SUMMARY"
        | "REJECTED"
        | "REQUESTED_EDIT",
      public_mode: post.public_mode as
        | "PUBLIC"
        | "PRIVATE"
        | "PRIVATE_SHARED"
        | "SHARE_ORGANIZATION",
      // Required fields for Document interface
      user: {
        _id: "",
        first_name: "",
        last_name: "",
        contact_email: "",
        organization: { _id: "", name: "" },
        shared_documents: [],
      },
      author: [],
      file_type: "PDF",
      organization: { _id: "", name: "" },
      level: "STUDENT",
      subject: { _id: "", name: "" },
      doc_type: "OTHER",
      intensive: false,
      download_count: 0,
      description: {
        summary_by_user: `${post.views} lượt xem • ${post.comments} bình luận • Đánh giá: ${post.rating}`,
      },
    };
  };

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
        {displayData.map((post) => {
          const documentData = transformPostToDocument(post);
          const isRejected = post.status === "REJECTED";
          const isRequestedEdit =
            post.status === "REQUESTED_EDIT" || post.status === "PENDING_EDIT";
          const hasRejectionMessage = post.content_rejection?.message;
          const showRejectionReason =
            (isRejected || isRequestedEdit) && hasRejectionMessage;
          return (
            <Col
              key={post.key}
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
                          {post.title}
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
                          {post.content_rejection?.message}
                        </div>
                      </div>
                    ) : (
                      post.title
                    )
                  }
                  description={`${post.views} lượt xem • ${post.comments} bình luận • Đánh giá: ${post.rating}`}
                  imageUrl={post.cover_page}
                  document={documentData}
                  navigationPath={
                    isRejected
                      ? undefined
                      : `/personal-posts/document-detail/${post.key}`
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
