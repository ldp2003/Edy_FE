import React, { useContext } from "react";
import PointBox from "../../common/point/PointBox";
import { Edit } from "lucide-react";
import { UserContext } from "../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const PersonalInfo: React.FC = () => {
  const { user, account } = useContext(UserContext);
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate("/edit-profile");
  };

  const handleViewMorePoints = () => {
    navigate("/point-management?showHistory=true");
  };

  return (
    <div className="px-2 sm:px-0 md:ml-6 w-full md:w-3/4">
      <div className="flex flex-col sm:flex-row justify-between text-sm md:text-lg my-3 sm:my-4 border-b border-gray-300 pb-2 gap-2">
        <div className="text-sm sm:text-base font-bold text-center sm:text-left text-[var(--primary-text-color)]">
          THÔNG TIN CÁ NHÂN
        </div>
        <div
          className="cursor-pointer flex text-[var(--primary-color)] border-[var(--primary-color)] items-center border rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium hover:bg-blue-50 w-fit mx-auto sm:mx-0"
          onClick={handleEditClick}
        >
          <span className="hidden sm:inline">Chỉnh sửa</span>
          <span className="sm:hidden">Sửa</span>
          <Edit className="ml-1" size={16} />
        </div>
      </div>
      <div className="flex flex-col xl:flex-row justify-between w-full gap-4 xl:gap-0">
        <div className="flex flex-col text-xs sm:text-sm text-left w-full xl:w-3/5">
          <div className="flex flex-row my-1 sm:my-2">
            <div className="w-2/5 sm:w-1/3 lg:w-2/7 font-bold text-xs sm:text-sm">
              Họ và tên:
            </div>
            <div className="w-3/5 sm:w-2/3 lg:w-5/7 text-xs sm:text-sm break-words">
              {user?.first_name} {user?.last_name}
            </div>
          </div>
          <div className="flex flex-row my-1 sm:my-2">
            <div className="w-2/5 sm:w-1/3 lg:w-2/7 font-bold text-xs sm:text-sm">
              Tổ chức:
            </div>
            <div className="w-3/5 sm:w-2/3 lg:w-5/7 text-xs sm:text-sm break-words">
              {typeof user?.organization === "object" &&
              user?.organization !== null
                ? user.organization.name
                : "Không có tổ chức"}
            </div>
          </div>
          <div className="flex flex-row my-1 sm:my-2">
            <div className="w-2/5 sm:w-1/3 lg:w-2/7 font-bold text-xs sm:text-sm">
              Email:
            </div>
            <div className="w-3/5 sm:w-2/3 lg:w-5/7 text-xs sm:text-sm break-words">
              {user?.contact_email}
            </div>
          </div>
          <div className="flex flex-row my-1 sm:my-2">
            <div className="w-2/5 sm:w-1/3 lg:w-2/7 font-bold text-xs sm:text-sm">
              Tài khoản:
            </div>
            <div className="w-3/5 sm:w-2/3 lg:w-5/7 text-xs sm:text-sm">
              {account?.is_vip ? "VIP" : "Thường"}
            </div>
          </div>
        </div>
        <div className="w-full xl:w-2/5">
          <PointBox
            rankPoints={user?.rank_point}
            freeDownloads={user?.free_download_count}
            usagePoints={user?.point}
            violations={user?.strike}
            onViewMore={handleViewMorePoints}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
