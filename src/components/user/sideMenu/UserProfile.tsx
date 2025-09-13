import { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";

interface UserProfileProps {
  isCompact?: boolean;
}

export function UserProfile({ isCompact }: UserProfileProps) {
  const { user } = useContext(UserContext);

  console.log("User in UserProfile:", user);
  return (
    <div
      className={`p-4 border-b border-gray-200 ${
        isCompact ? "flex justify-center" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          <img
            src="/placeholder.svg?height=48&width=48"
            alt="Avatar"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const sibling = e.currentTarget
                .nextElementSibling as HTMLElement | null;
              if (sibling) {
                sibling.style.display = "flex";
              }
            }}
          />
          <span className="text-sm font-medium text-gray-600 hidden">NA</span>
        </div>
        {!isCompact && (
          <div className="text-left flex-1">
            <a href="personal-profile" className="font-bold text-base">
              {user?.first_name} {user?.last_name}
            </a>
            <p
              className="text-xs font-bold overflow-hidden whitespace-nowrap text-ellipsis"
              style={{ color: "var(--primary-color)", maxWidth: "150px" }}
            >
              {user?.organization?._id || "No Organization"}
            </p>
          </div>
        )}
      </div>
      {!isCompact && (
        <div
          className="flex justify-between mt-3 text-center pt-7"
          style={{ color: "var(--primary-text-color)" }}
        >
          <div>
            <div className="text-lg font-bold ">{user?.point}</div>
            <div className="text-xs ">Điểm tiêu dùng</div>
          </div>
          <div>
            <div className="text-lg font-bold ">{user?.rank_point}</div>
            <div className="text-xs ">Điểm hạng</div>
          </div>
          <div>
            <div className="text-lg font-bold ">
              {user?.shared_documents.length}
            </div>
            <div className="text-xs ">Bài đăng</div>
          </div>
        </div>
      )}
    </div>
  );
}
