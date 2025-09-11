import React from "react";
import PointBox from "../../common/point/PointBox";

const PersonalInfo: React.FC = () => {
  return (
    <div className="ml-6 w-3/4">
      <div className="flex flex-row justify-between text-lg my-4 border-b border-gray-300 pb-2">
        <div className="text-sm font-medium">THÔNG TIN CÁ NHÂN</div>
        <div className="text-blue-500 cursor-pointer flex items-center">
          <span>Chỉnh sửa</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 ml-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 3.487c.28-.28.735-.28 1.015 0l2.636 2.636c.28.28.28.735 0 1.015L7.5 20.141l-4.125.458.458-4.125L16.862 3.487z"
            />
          </svg>
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
