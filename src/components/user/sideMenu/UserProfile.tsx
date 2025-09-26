import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../contexts/UserContext";

interface UserProfileProps {
  isCompact?: boolean;
}

export function UserProfile({ isCompact }: UserProfileProps) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleOrganizationClick = () => {
    if (
      user?.organization &&
      typeof user.organization === "object" &&
      user.organization._id
    ) {
      navigate(`/organization/${user.organization._id}`);
    }
  };

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
            src={user?.avatar || "/default-avatar.png"}
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
            <a href="personal-profile" className="font-bold text-sm">
              {user?.first_name} {user?.last_name}
            </a>
            <p
              className="text-[10px] font-bold overflow-hidden whitespace-nowrap text-ellipsis cursor-pointer hover:underline"
              style={{ color: "var(--primary-color)", maxWidth: "150px" }}
              onClick={handleOrganizationClick}
            >
              {typeof user?.organization === "object"
                ? user.organization?.name
                : user?.organization || "No Organization"}
            </p>
          </div>
        )}
      </div>
      {!isCompact && (
        <div className="flex justify-between mt-3 text-center text-[var(--primary-text-color)]">
          <div>
            <div className="text-xs font-bold ">{user?.point}</div>
            <div className="text-[10px] ">Điểm tiêu dùng</div>
          </div>
          <div>
            <div className="text-xs font-bold ">{user?.rank_point}</div>
            <div className="text-[10px] ">Điểm hạng</div>
          </div>
          <div>
            <div className="text-xs font-bold ">{user?.doc_count}</div>
            <div className="text-[10px] ">Bài đăng</div>
          </div>
        </div>
      )}
    </div>
  );
}
