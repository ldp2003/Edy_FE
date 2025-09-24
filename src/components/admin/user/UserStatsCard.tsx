import React from "react";
import { Card } from "antd";
import { BookOpen, Award, Users } from "lucide-react";
import type { User } from "../../../models/user";

interface UserStatsCardProps {
  user: User;
}

const UserStatsCard: React.FC<UserStatsCardProps> = ({ user }) => {
  return (
    <Card title="Thống kê" className="mt-4">
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="flex items-center space-x-2">
            <BookOpen size={16} />
            <span>Số tài liệu:</span>
          </span>
          <span className="font-semibold">{user.doc_count || 0}</span>
        </div>

        <div className="flex justify-between">
          <span className="flex items-center space-x-2">
            <Award size={16} />
            <span>Điểm:</span>
          </span>
          <span className="font-semibold">{user.point || 0}</span>
        </div>

        <div className="flex justify-between">
          <span className="flex items-center space-x-2">
            <Users size={16} />
            <span>Người theo dõi:</span>
          </span>
          <span className="font-semibold">{user.follower?.length || 0}</span>
        </div>

        <div className="flex justify-between">
          <span className="flex items-center space-x-2">
            <Users size={16} />
            <span>Đang theo dõi:</span>
          </span>
          <span className="font-semibold">{user.following?.length || 0}</span>
        </div>
      </div>
    </Card>
  );
};

export default UserStatsCard;
