import React from "react";
import { Card, Avatar, Tag } from "antd";
import { Mail, Calendar, MapPin } from "lucide-react";
import type { User } from "../../../models/user";

interface UserProfileCardProps {
  user: User;
  getStatusColor: (status?: string) => string;
  getStatusText: (status?: string) => string;
  formatDate: (dateString?: string) => string;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  getStatusColor,
  getStatusText,
  formatDate,
}) => {
  return (
    <Card>
      <div className="text-center">
        <Avatar size={120} src={user.avatar} className="mb-4">
          {user.first_name.charAt(0)}
          {user.last_name.charAt(0)}
        </Avatar>

        <h2 className="text-xl font-bold mb-2">
          {user.first_name} {user.last_name}
        </h2>

        <Tag color={getStatusColor(user.status)} className="mb-4">
          {getStatusText(user.status)}
        </Tag>

        <div className="space-y-2 text-left">
          <div className="flex items-center space-x-2 text-gray-600">
            <Mail size={16} />
            <span className="text-sm">{user.contact_email}</span>
          </div>

          {typeof user.organization === "object" && user.organization && (
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin size={16} />
              <span className="text-sm">{user.organization.name}</span>
            </div>
          )}

          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar size={16} />
            <span className="text-sm">
              Tham gia: {formatDate(user.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserProfileCard;
