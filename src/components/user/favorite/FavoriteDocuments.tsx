import React, { useState, useEffect } from "react";
import { Row, Col, Spin, Empty, message, Button } from "antd";
import { RefreshCw } from "lucide-react";
import { UserService } from "../../../utils/UserService";
import DocumentCard from "../../common/cards/DocumentCard";


const FavoriteDocuments: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavoriteDocuments = async () => {
    try {
      setLoading(true);
      const response = await UserService.getListFavorites();
      setDocuments(response.documents || []);
    } catch (error) {
      console.error("Error fetching favorite documents:", error);
      message.error("Không thể tải danh sách tài liệu yêu thích!");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (documentId: string) => {
    try {
      await UserService.removeFromFavorites(documentId);
      message.success("Đã xóa khỏi danh sách yêu thích!");
      // Refresh the list
      fetchFavoriteDocuments();
    } catch (error) {
      console.error("Error removing from favorites:", error);
      message.error("Có lỗi xảy ra khi xóa tài liệu!");
    }
  };

  useEffect(() => {
    fetchFavoriteDocuments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <Empty
          description="Chưa có tài liệu yêu thích nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={() => (window.location.href = "/")}>
            Khám phá tài liệu
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="mb-6 flex items-center text-left justify-between">
        <div>
          <h2 className="text-base text-left font-bold text-gray-900 mb-2">
            Tài liệu yêu thích của bạn
          </h2>
          <p className="text-sm text-gray-600">
            Bạn đã lưu {documents.length} tài liệu vào danh sách yêu thích
          </p>
        </div>

        <Button icon={<RefreshCw size={16} />} onClick={fetchFavoriteDocuments}>
          Làm mới
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {documents.map((document) => (
          <Col key={document._id} xs={24} sm={12} md={8} lg={6} xxl={4}>
            <DocumentCard
              document={document}
              onRemove={handleRemoveFromFavorites}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FavoriteDocuments;
