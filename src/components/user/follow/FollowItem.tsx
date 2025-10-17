import React from "react";
import { Avatar } from "antd";
import type { User } from "../../../models/user";
import FollowButton from "../../common/buttons/FollowButton";

interface FollowItemProps {
  user: User;
}

const FollowItem: React.FC<FollowItemProps> = ({ user }) => {
  const handlerOnclick = () => {
    window.location.href = `/user/${user._id}`;
  };

  return (
    <div
      className="cursor-pointer hover:bg-gray-100 hover:rounded-2xl flex text-left items-center p-4 border-b border-gray-200"
      onClick={handlerOnclick}
    >
      <Avatar size={48} src={user.avatar} />
      <div className="ml-4 flex-1">
        <h3 className="font-semibold text-base text-[var(--primary-text-color)]">
          {user.first_name} {user.last_name}
        </h3>
        <div className="text-sm text-[var(--third-text-color)] flex flex-row gap-2 items-center">
          <p>
            {typeof user.organization === "object" && user.organization !== null
              ? user.organization.name
              : user.organization}
          </p>
          <span className="text-[var(--third-text-color)] text-xl">•</span>
          <p>
            Bài đăng:{" "}
            <span className="font-semibold text-[var(--secondary-text-color)]">
              {user.doc_count}
            </span>
          </p>
          <span className="text-[var(--third-text-color)] text-xl">•</span>
          <p>
            Điểm hạng:{" "}
            <span className="font-semibold text-[var(--secondary-text-color)]">
              {user.rank_point}
            </span>
          </p>
        </div>
      </div>
      <FollowButton user={user} size="small" />
    </div>
  );
};

export default FollowItem;
