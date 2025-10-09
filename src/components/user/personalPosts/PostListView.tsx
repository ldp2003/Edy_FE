import React from "react";
import { useNavigate } from "react-router-dom";
import RecentItem from "../document/documentCard/RecentItem";
import { fetchMultipleDocumentRatings } from "../../../utils/CalcRate";

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
  intensive?: boolean;
  createdAt: string;
  content_rejection?: {
    message: string;
  };
}

interface PostListViewProps {
  data: Post[];
  loading?: boolean;
}

const PostListView: React.FC<PostListViewProps> = ({ data, loading }) => {
  const navigate = useNavigate();
  const [documentRating, setDocumentRating] = React.useState<{
    [key: string]: { ratingPercentage: number; formattedRating: string };
  }>({});

  // Fetch document ratings when data changes
  React.useEffect(() => {
    const fetchRatings = async () => {
      if (data && data.length > 0) {
        try {
          const documentIds = data.map((doc) => doc.key);
          const ratingsMap = await fetchMultipleDocumentRatings(documentIds);

          const ratings: {
            [key: string]: {
              ratingPercentage: number;
              formattedRating: string;
            };
          } = {};
          documentIds.forEach((id) => {
            const rating = ratingsMap.get(id);
            if (rating) {
              ratings[id] = rating;
            } else {
              ratings[id] = { ratingPercentage: 0, formattedRating: "0%" };
            }
          });

          setDocumentRating(ratings);
        } catch (error) {
          console.error("Error fetching document ratings:", error);
          // Set default values on error
          const defaultRatings: {
            [key: string]: {
              ratingPercentage: number;
              formattedRating: string;
            };
          } = {};
          data.forEach((doc) => {
            defaultRatings[doc.key] = {
              ratingPercentage: 0,
              formattedRating: "0%",
            };
          });
          setDocumentRating(defaultRatings);
        }
      } else {
        setDocumentRating({});
      }
    };

    fetchRatings();
  }, [data]);

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
              key={post.key}
              className={
                isRejected
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer transition-transform hover:scale-[1.02]"
              }
              onClick={
                isRejected
                  ? undefined
                  : () => navigate(`/personal-posts/${post.key}`)
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
                views={post.views}
                rating={documentRating[post.key]?.ratingPercentage || 0}
                pages={Math.floor(Math.random() * 50) + 10}
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
