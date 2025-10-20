import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { Row, Col, message } from "antd";
import { UserService } from "../../../utils/UserService";
import FavoriteCard from "./FavoriteCard";
import FavoriteListItem from "./FavoriteListItem";
import FavoriteHeader from "./FavoriteHeader";
import { FavoriteLoading, FavoriteEmpty } from "./FavoriteStates";

const FavoriteDocuments: React.FC = () => {
  const { favoriteDocuments, setFavoriteDocuments } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchFavoriteDocuments = async () => {
    try {
      setLoading(true);
      const response = await UserService.getListFavorites();
      setFavoriteDocuments(response.documents || []);
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
      console.log("Removed document ID:", documentId);

      message.success("Đã xóa khỏi danh sách yêu thích!");
      // Refresh the list
      fetchFavoriteDocuments();
    } catch (error) {
      console.error("Error removing from favorites:", error);
      message.error("Có lỗi xảy ra khi xóa tài liệu!");
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchFavoriteDocuments();
    return () => {
      controller.abort();
    };
  }, []);

  // Show loading state
  if (loading) {
    return <FavoriteLoading loading={loading} />;
  }

  // Show empty state
  if (!favoriteDocuments || favoriteDocuments.length === 0) {
    return <FavoriteEmpty isEmpty={true} />;
  }

  return (
    <div className="bg-white border border-[var(--border-color)] rounded-md max-h-screen h-fit p-6">
      <FavoriteHeader
        documentsCount={favoriteDocuments.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRefresh={fetchFavoriteDocuments}
      />

      {/* Documents Display */}
      {viewMode === "grid" ? (
        <Row gutter={[16, 16]}>
          {favoriteDocuments.map((document) => (
            <Col key={document._id} xs={12} sm={10} md={6} lg={4} xxl={3}>
              <FavoriteCard
                document={document}
                onRemove={handleRemoveFromFavorites}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="space-y-4">
          {favoriteDocuments.map((document) => (
            <FavoriteListItem
              key={document._id}
              document={document}
              onRemove={handleRemoveFromFavorites}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteDocuments;
