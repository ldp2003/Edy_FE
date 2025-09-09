import React from "react";
import PostsPointBox from "../../common/point/PostsPointBox";

const UserInfoHeader: React.FC = () => {
  return (
    <div className="flex items-start justify-between p-4 bg-blue-50 rounded-md mb-4">
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-row text-left items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <img
              src="/placeholder.svg?height=64&width=64"
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold">Nguyễn Văn A</h3>
            <p className="text-sm text-gray-600">
              Trường Đại học Công nghiệp TP. Hồ Chí Minh
            </p>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="text-center">
            <div className="text-xl font-bold">0</div>
            <div className="text-sm text-gray-600">Đang theo dõi</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">0</div>
            <div className="text-sm text-gray-600">Người theo dõi</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">5</div>
            <div className="text-sm text-gray-600">Tài liệu</div>
          </div>
        </div>
      </div>
      <PostsPointBox rankPoints={15} usagePoints={15} accountType="Thường" />
    </div>
  );
};

export default UserInfoHeader;
