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
    <div className="md:ml-6 w-full md:w-3/4">
      <div className="flex flex-row justify-between text-sm md:text-lg my-4 border-b border-gray-300 pb-2">
        <div className="text-base text-left font-bold sm:text-center text-[var(--primary-text-color)]">
          THÔNG TIN CÁ NHÂN
        </div>
        <div
          className="cursor-pointer flex text-[var(--primary-color)] border-[var(--primary-color)] items-center border rounded-full px-3 py-1 text-sm font-medium  hover:bg-blue-50 w-fit"
          onClick={handleEditClick}
        >
          <span>Chỉnh sửa</span>
          <Edit className="ml-1" size={20} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between w-full gap-4 md:gap-0">
        <div className="flex flex-col text-sm text-left w-full md:w-3/5">
          <div className="flex flex-row my-1 md:my-2">
            <div className="md:w-2/7 w-1/2 font-bold">Họ và tên:</div>
            <div className="w-6/7">
              {user?.first_name} {user?.last_name}
            </div>
          </div>
          <div className="flex flex-row my-1 md:my-2">
            <div className="md:w-2/7 w-1/2 font-bold">Tổ chức:</div>
            <div className="w-6/7">
              {typeof user?.organization === "object" &&
              user?.organization !== null
                ? user.organization.name
                : "Không có tổ chức"}
            </div>
          </div>
          <div className="flex flex-row my-1 md:my-2">
            <div className="md:w-2/7 w-1/2 font-bold">Email:</div>
            <div className="w-6/7">{user?.contact_email}</div>
          </div>
          <div className="flex flex-row my-1 md:my-2">
            <div className="md:w-2/7 w-1/2 font-bold">Tài khoản:</div>
            <div className="w-6/7">{account?.is_vip ? "VIP" : "Thường"}</div>
          </div>
        </div>
        <div className="w-full md:w-2/5">
          <PointBox
            rankPoints={user?.rank_point}
            freeDownloads={user?.free_download_count}
            usagePoints={user?.point}
            violations={user?.strike}
            onViewMore={handleViewMorePoints}
          ></PointBox>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
