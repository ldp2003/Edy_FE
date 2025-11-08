import { Avatar } from "antd";
import { School } from "lucide-react";
import type { Document } from "../../../models/document";
import { useState } from "react";

import FollowButton from "../buttons/FollowButton";

interface AuthorInfoProps {
  document: Document;
}

const AuthorInfo: React.FC<AuthorInfoProps> = ({ document }) => {
  const [followerCount, setFollowerCount] = useState(
    document.user.follower?.length || 0
  );

  const handlerOnclick = () => {
    // user-profile/:userId
    window.location.href = `/user/${document.user._id}`;
  };

  const handleFollowerCountChange = (increment: boolean) => {
    if (increment) {
      setFollowerCount((prev) => prev + 1);
    } else {
      setFollowerCount((prev) => Math.max(prev - 1, 0));
    }
  };
  return (
    <>
      <div className="flex flex-col lg:flex-row text-center lg:text-left items-center justify-center lg:justify-between p-4 bg-white border border-[var(--border-color)] rounded-xl mb-6 shadow gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center sm:justify-start w-full lg:w-auto">
          <Avatar size={64} className="bg-gray-200 flex-shrink-0">
            {document.user.avatar ? (
              <img
                src={document.user.avatar}
                alt="Avatar"
                className="cursor-pointer w-full h-full object-cover"
                onClick={handlerOnclick}
              />
            ) : (
              <img
                src="/placeholder.svg?height=100&width=100"
                alt="Avatar"
                className="cursor-pointer w-full h-full object-cover"
                onClick={handlerOnclick}
              />
            )}
          </Avatar>
          <div className="flex flex-col gap-2 items-center sm:items-start">
            <h3
              className="font-semibold text-sm sm:text-base lg:text-lg text-[var(--primary-color)] cursor-pointer hover:underline"
              onClick={handlerOnclick}
            >
              {document.user.first_name} {document.user.last_name}
            </h3>
            <div className="flex flex-row gap-2 items-center">
              <School
                size={14}
                className="text-[var(--secondary-text-color)]"
              />
              <p
                className="text-[10px] sm:text-xs lg:text-sm font-medium cursor-pointer hover:underline text-[var(--secondary-text-color)]"
                onClick={() => {
                  if (document.organization && document.organization._id) {
                    window.location.href = `/organization/${document.organization._id}`;
                  }
                }}
              >
                {document.organization.name}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-3 w-full lg:w-auto text-[var(--primary-text-color)]">
          <div className="flex flex-row justify-center space-x-4 sm:space-x-6">
            <div className="text-center">
              <div className="font-semibold text-xs sm:text-sm lg:text-base">
                {followerCount}
              </div>
              <div className="text-[10px] sm:text-xs lg:text-sm text-[var(--secondary-text-color)]">
                Người theo dõi
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-xs sm:text-sm lg:text-base">
                {document.user.following?.length || 0}
              </div>
              <div className="text-[10px] sm:text-xs lg:text-sm text-[var(--secondary-text-color)]">
                Đang theo dõi
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-xs sm:text-sm lg:text-base">
                {document.user.doc_count || 0}
              </div>
              <div className="text-[10px] sm:text-xs lg:text-sm text-[var(--secondary-text-color)]">
                Bài đăng
              </div>
            </div>
          </div>
          <div className="flex justify-center w-full sm:w-auto">
            <FollowButton
              user={document.user}
              size="default"
              onFollowerCountChange={handleFollowerCountChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default AuthorInfo;
