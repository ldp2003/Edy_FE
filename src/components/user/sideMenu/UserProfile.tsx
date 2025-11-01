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

  return (
    <div
      className={`p-4 border-b border-gray-200 ${
        isCompact ? "flex justify-center" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          <img
            src={user?.avatar || "/image/avatar-default.svg"}
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
        </div>
        {!isCompact && (
          <div className="text-left flex-1">
            <div
              className="font-bold text-sm cursor-pointer hover:underline"
              onClick={() => (window.location.href = "/personal-profile")}
            >
              {user?.first_name} {user?.last_name}
            </div>
            <p
              className="text-[10px] font-bold overflow-hidden whitespace-nowrap text-ellipsis cursor-pointer hover:underline"
              style={{ color: "var(--primary-color)", maxWidth: "150px" }}
              onClick={handleOrganizationClick}
            >
              {typeof user?.organization === "object"
                ? user.organization?.name
                : user?.organization || "Chưa có trường/tổ chức"}
            </p>
          </div>
        )}
      </div>
      {!isCompact && (
        <div className="flex justify-between mt-3 text-center text-[var(--primary-text-color)]">
          <div
            className="cursor-pointer rounded px-2 py-1 transition-colors"
            onClick={() => navigate("/point-management?showHistory=true")}
          >
            <div className="text-xs font-bold hover:text-[var(--primary-color)]">
              {user?.point}
            </div>
            <div className="text-[10px]">Điểm tiêu dùng</div>
          </div>
          <div
            className="cursor-pointer rounded px-2 py-1 transition-colors"
            onClick={() => navigate("/point-management?showHistory=true")}
          >
            <div className="text-xs font-bold hover:text-[var(--primary-color)]">
              {user?.rank_point}
            </div>
            <div className="text-[10px]">Điểm hạng</div>
          </div>
          <div
            className="cursor-pointer rounded px-2 py-1 transition-colors"
            onClick={() => navigate("/personal-posts")}
          >
            <div className="text-xs font-bold hover:text-[var(--primary-color)]">
              {user?.doc_count}
            </div>
            <div className="text-[10px]">Bài đăng</div>
          </div>
        </div>
      )}
    </div>
  );
}
