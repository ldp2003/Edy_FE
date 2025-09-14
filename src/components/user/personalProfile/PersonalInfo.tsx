import React, { useContext } from "react";
import PointBox from "../../common/point/PointBox";
import { Edit } from "lucide-react";
import { UserContext } from "../../../contexts/UserContext";

const PersonalInfo: React.FC = () => {
  const { user, account } = useContext(UserContext);

  return (
    <div className="ml-6 w-3/4">
      <div className="flex flex-row justify-between text-lg my-4 border-b border-gray-300 pb-2">
        <div className="text-base font-medium">THÔNG TIN CÁ NHÂN</div>
        <div
          className="cursor-pointer flex items-center border rounded-full px-3 py-1 text-sm font-medium  hover:bg-blue-50 w-fit"
          style={{
            color: "var(--primary-color)",
            borderColor: "var(--primary-color)",
          }}
        >
          <span>Chỉnh sửa</span>
          <Edit className="ml-1" size={20} />
        </div>
      </div>
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-col text-sm text-left w-3/5">
          <div className="flex flex-row my-2">
            <div className="w-1/7 font-bold">Họ và tên:</div>
            <div className="w-6/7">
              {user?.first_name} {user?.last_name}
            </div>
          </div>
          <div className="flex flex-row my-2">
            <div className="w-1/7 font-bold">Tổ chức:</div>
            <div className="w-6/7">
              {user?.organization?._id || "Không có tổ chức"}
            </div>
          </div>
          <div className="flex flex-row my-2">
            <div className="w-1/7 font-bold">Email:</div>
            <div className="w-6/7">{user?.contact_email}</div>
          </div>
          <div className="flex flex-row my-2">
            <div className="w-1/7 font-bold">Tài khoản:</div>
            <div className="w-6/7">{account?.is_vip ? "VIP" : "Thường"}</div>
          </div>
        </div>
        <div className="w-2/5">
          <PointBox
            rankPoints={user?.rank_point}
            freeDownloads={user?.free_download_count}
            usagePoints={user?.point}
            violations={user?.strike}
          ></PointBox>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
