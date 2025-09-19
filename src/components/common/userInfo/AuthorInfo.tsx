import { Avatar, Button } from "antd";
import { School, UserPlus } from "lucide-react";
import type { Document } from "../../../models/document";

interface AuthorInfoProps {
  document: Document;
}

const AuthorInfo: React.FC<AuthorInfoProps> = ({ document }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 rounded-xl mb-6 shadow">
      <div className="flex items-center flex-row gap-4">
        <Avatar size={80} className="bg-gray-200">
          {document.user.avatar ? (
            <img
              src={document.user.avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src="/placeholder.svg?height=100&width=100"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          )}
        </Avatar>
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-base text-[var(--primary-color)]">
            {document.user.first_name} {document.user.last_name}
          </h3>
          <div className="flex flex-row gap-2 items-center">
            <School size={16} />
            <p className="text-sm font-semibold">
              {document.organization.name}
            </p>
          </div>
        </div>
      </div>

      <div
        className="flex flex-col items-center space-y-6"
        style={{ color: "var(--primary-text-color)" }}
      >
        <div className="flex flex-row space-x-6">
          <div className="text-center">
            <div className="font-semibold text-xs">
              {document.user.follower?.length || 0}
            </div>
            <div className="text-xs">Người theo dõi</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-xs">
              {document.user.following?.length || 0}
            </div>
            <div className="text-xs">Đang theo dõi</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-xs">
              {document.user.doc_count || 0}
            </div>
            <div className="text-xs">Bài đăng</div>
          </div>
        </div>

        <Button
          type="primary"
          size="middle"
          style={{
            backgroundColor: "var(--field-background-color",
            borderColor: "#665e4c",
            color: "#000000",
            width: "100%",
            borderRadius: "20px",
            fontWeight: "500",
            height: "36px",
            borderWidth: "0.5px",
          }}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Theo dõi
        </Button>
      </div>
    </div>
  );
};
export default AuthorInfo;
