import React from "react";
import { useNavigate } from "react-router-dom";
import RecentItem from "../document/documentCard/RecentItem";
import { calculateDocumentRating } from "../../../utils/CalcRate";
import type { Document } from "../../../models/document";

interface PostListViewProps {
  data: Document[];
  loading?: boolean;
}

const PostListView: React.FC<PostListViewProps> = ({ data, loading }) => {
  const navigate = useNavigate();

  // Nếu loading, hiển thị skeleton hoặc rỗng
  const displayData = loading ? [] : data;

  return (
    <div className="w-full">
      {/* List content */}
      <div className="space-y-2">
        {displayData.map((post) => {
          const isRejected = post.status === "REJECTED";
          const isRequestedEdit =
            post.status === "REQUESTED_EDIT" || post.status === "PENDING_EDIT";
          const hasRejectionMessage = post.content_rejection?.message;
          const showRejectionReason =
            (isRejected || isRequestedEdit) && hasRejectionMessage;
          return (
            <div
              key={post._id}
              className={
                isRejected
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer transition-transform hover:scale-[1.02]"
              }
              onClick={
                isRejected
                  ? undefined
                  : () => navigate(`/personal-posts/${post._id}`)
              }
            >
              <RecentItem
                title={
                  showRejectionReason ? (
                    <div>
                      <span
                        className={
                          isRejected ? "line-through text-gray-400" : ""
                        }
                        style={{ fontSize: "12px" }}
                      >
                        {post.title}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          color: isRejected ? "#e74c3c" : "#f39c12",
                          fontStyle: "italic",
                          marginLeft: "8px",
                        }}
                      >
                        ({isRejected ? "Lý do từ chối" : "Yêu cầu chỉnh sửa"}:{" "}
                        {post.content_rejection?.message})
                      </span>
                    </div>
                  ) : (
                    post.title
                  )
                }
                views={post.view || 0}
                rating={
                  calculateDocumentRating(post.like || 0, post.dislike || 0)
                    .ratingPercentage
                }
                pages={post.page || 0}
                date={new Date(post.createdAt)}
                intensive={post.intensive}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostListView;
