import React from "react";
import PointBox from "../../common/point/PointBox";
import { Edit } from "lucide-react";

const PersonalInfo: React.FC = () => {
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
            <div className="w-6/7">Nguyễn Văn A</div>
          </div>
          <div className="flex flex-row my-2">
            <div className="w-1/7 font-bold">Tổ chức:</div>
            <div className="w-6/7">
              Trường Đại học Công Nghiệp Thành phố Hồ Chí Minh
            </div>
          </div>
          <div className="flex flex-row my-2">
            <div className="w-1/7 font-bold">Email:</div>
            <div className="w-6/7">abc123@gmail.com</div>
          </div>
          <div className="flex flex-row my-2">
            <div className="w-1/7 font-bold">Tài khoản:</div>
            <div className="w-6/7">Bình thường</div>
          </div>
        </div>
        <div className="w-2/5">
          <PointBox
            rankPoints={15}
            freeDownloads={3}
            usagePoints={15}
            violations={0}
          ></PointBox>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
