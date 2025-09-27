import React from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Spin, Card, Tag } from "antd";
import { Eye, MessageCircle, Star, Clock } from "lucide-react";
import {
  getStatusText,
  getPublicModeText,
} from "../../../locales/translationUtils";
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
}

interface PostGridViewProps {
  data: Post[];
  loading?: boolean;
}

const PostGridView: React.FC<PostGridViewProps> = ({ data, loading }) => {
  const navigate = useNavigate();

  const displayData = loading ? [] : data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "green";
      case "PENDING":
        return "orange";
      case "REJECTED":
        return "red";
      default:
        return "default";
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case "PUBLIC":
        return "blue";
      case "PRIVATE":
        return "red";
      case "PRIVATE_SHARED":
        return "purple";
      case "SHARE_ORGANIZATION":
        return "cyan";
      default:
        return "default";
    }
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
      <Row gutter={[16, 16]}>
        {displayData.map((post) => (
          <Col key={post.key} xs={24} sm={12} md={8} lg={6} xl={4}>
            <Card
              hoverable
              className="h-full"
              cover={
                <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center relative">
                  {post.cover_page ? (
                    <img
                      src={post.cover_page}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-6xl text-blue-200 mb-2">📄</div>
                      <div className="text-sm text-blue-400 font-medium">
                        Bài đăng
                      </div>
                    </div>
                  )}

                  {/* Status badge */}
                  <div className="absolute top-2 left-2">
                    <Tag color={getStatusColor(post.status)}>
                      {getStatusText(post.status)}
                    </Tag>
                  </div>

                  {/* Mode badge */}
                  <div className="absolute top-2 right-2">
                    <Tag color={getModeColor(post.public_mode)}>
                      {getPublicModeText(post.public_mode)}
                    </Tag>
                  </div>
                </div>
              }
              onClick={() =>
                navigate(`/personal-posts/document-detail/${post.key}`)
              }
            >
              <Card.Meta
                title={
                  <div className="line-clamp-2 h-12 text-sm font-semibold">
                    {post.title}
                  </div>
                }
                description={
                  <div className="space-y-2">
                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye size={12} />
                        {post.views} lượt xem
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={12} />
                        {post.comments} bình luận
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 text-xs">
                      <Star size={12} className="text-yellow-500" />
                      <span>Đánh giá: {post.rating}</span>
                    </div>

                    {/* Created date */}
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={12} />
                      {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PostGridView;
