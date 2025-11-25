import React, { useState, useEffect, useContext, useCallback } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { Row, Col, message } from "antd";
import { UserService } from "../../../utils/UserService";
import DocumentCard from "../document/documentCard/DocumentCard";
import DocumentListItem from "../document/documentCard/DocumentListItem";
import FavoriteHeader from "./FavoriteHeader";
import { FavoriteEmpty } from "./FavoriteStates";
import LoadingScreen from "../../common/LoadingScreen";

const FavoriteDocuments: React.FC = () => {
  const { favoriteDocuments, setFavoriteDocuments } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchFavoriteDocuments = useCallback(async () => {
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
  }, [setFavoriteDocuments]);

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
  }, [fetchFavoriteDocuments]);

  // Show loading state
  if (loading) {
    return <LoadingScreen />;
  }

  // Show empty state
  if (!favoriteDocuments || favoriteDocuments.length === 0) {
    return <FavoriteEmpty isEmpty={true} />;
  }

  return (
    <div className="bg-white border border-[var(--border-color)] rounded-md max-h-screen h-fit p-4 sm:p-6 md:p-8">
      <FavoriteHeader
        documentsCount={favoriteDocuments.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRefresh={fetchFavoriteDocuments}
      />

      {/* Documents Display */}
      {viewMode === "grid" ? (
        <Row gutter={[12, 12]} className="mt-4 sm:mt-6">
          {favoriteDocuments.map((document) => (
            <Col key={document._id}>
              <DocumentCard document={document} />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
          {favoriteDocuments.map((document) => (
            <DocumentListItem
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
