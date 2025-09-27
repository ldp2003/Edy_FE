import React, { useContext } from "react";
import PostsPointBox from "../../common/point/PostsPointBox";
import { UserContext } from "../../../contexts/UserContext";

const UserInfoHeader: React.FC = () => {
  const { user, account } = useContext(UserContext);

  const organizationName =
    typeof user?.organization === "object" && user?.organization !== null
      ? user.organization.name
      : "Không có tổ chức";

  const isLoading = !user || !account;

  return (
    <div className="flex items-start justify-between p-4 rounded-md mb-4 bg-[var(--primary-background-color)] shadow-lg">
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-row justify-start w-full text-left items-center gap-2">
          <div className="w-15 h-15 mt-4 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <img
              src={user?.avatar || "/default-avatar.png"}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-left">
            <h3 className="text-base font-bold">
              {isLoading ? (
                <span className="animate-pulse bg-gray-300 rounded w-32 h-6 inline-block"></span>
              ) : (
                <>
                  {user?.first_name} {user?.last_name}
                </>
              )}
            </h3>
            <p className="text-sm font-bold text-[var(--primary-color)]">
              {isLoading ? (
                <span className="animate-pulse bg-gray-200 rounded w-24 h-4 inline-block"></span>
              ) : (
                organizationName
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-8 text-[var(--primary-text-color)]">
          <div className="text-center">
            <div className="">
              {isLoading ? (
                <span className="animate-pulse bg-gray-200 rounded w-8 h-4 inline-block"></span>
              ) : (
                user?.following?.length ?? 0
              )}
            </div>
            <div className="text-[10px]">Đang theo dõi</div>
          </div>
          <div className="text-center">
            <div className="">
              {isLoading ? (
                <span className="animate-pulse bg-gray-200 rounded w-8 h-4 inline-block"></span>
              ) : (
                user?.follower?.length ?? 0
              )}
            </div>
            <div className="text-[10px]">Người theo dõi</div>
          </div>
          <div className="text-center">
            <div className="">
              {isLoading ? (
                <span className="animate-pulse bg-gray-200 rounded w-8 h-4 inline-block"></span>
              ) : (
                user?.doc_count ?? 0
              )}
            </div>
            <div className="text-[10px]">Tài liệu</div>
          </div>
        </div>
      </div>
      <PostsPointBox
        rankPoints={user?.rank_point || 0}
        usagePoints={user?.point || 0}
        accountType={account?.is_vip ? "VIP" : "Thường"}
        loading={isLoading}
      />
    </div>
  );
};

export default UserInfoHeader;
