import React from "react";
import { Spin, Empty, Button } from "antd";

interface FavoriteLoadingProps {
  loading: boolean;
}

export const FavoriteLoading: React.FC<FavoriteLoadingProps> = ({
  loading,
}) => {
  if (!loading) return null;

  return (
    <div className="flex justify-center items-center min-h-64">
      <Spin size="large" />
    </div>
  );
};

interface FavoriteEmptyProps {
  isEmpty: boolean;
}

export const FavoriteEmpty: React.FC<FavoriteEmptyProps> = ({ isEmpty }) => {
  if (!isEmpty) return null;

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
};
