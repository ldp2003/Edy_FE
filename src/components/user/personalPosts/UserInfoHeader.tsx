import React, { useContext } from "react";
import PostsPointBox from "../../common/point/PostsPointBox";
import { UserContext } from "../../../contexts/UserContext";

const UserInfoHeader: React.FC = () => {
  const { user, account } = useContext(UserContext);

  const organizationName =
    typeof user?.organization === "object" && user?.organization !== null
      ? user.organization.name
      : "Không có tổ chức";

  return (
    <div
      className="flex items-start justify-between p-4 rounded-md mb-4"
      style={{ backgroundColor: "var( --field-background-color)" }}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-row text-left items-center gap-2">
          <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <img
              src="/placeholder.svg?height=64&width=64"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold mb-8">
              {user?.first_name} {user?.last_name}
            </h3>
            <p
              className="text-lg font-bold"
              style={{ color: "var(--primary-color)" }}
            >
              {organizationName}
            </p>
          </div>
        </div>

        <div
          className="flex gap-8"
          style={{ color: "var(--primary-text-color)" }}
        >
          <div className="text-center">
            <div className="">{user?.following?.length ?? 0}</div>
            <div className="text-sm">Đang theo dõi</div>
          </div>
          <div className="text-center">
            <div className="">{user?.follower?.length ?? 0}</div>
            <div className="text-sm">Người theo dõi</div>
          </div>
          <div className="text-center">
            <div className="">{user?.shared_documents.length}</div>
            <div className="text-sm">Tài liệu</div>
          </div>
        </div>
      </div>
      <PostsPointBox
        rankPoints={user?.rank_point || 0}
        usagePoints={user?.point || 0}
        accountType={account?.is_vip ? "VIP" : "Thường"}
      />
    </div>
  );
};

export default UserInfoHeader;
