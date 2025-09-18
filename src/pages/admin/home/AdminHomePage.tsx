import React from "react";

const AdminHomePage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Trang chủ Admin
        </h1>
        <p className="text-gray-600">
          Chào mừng đến với trang quản trị hệ thống.
        </p>

        {/* Placeholder content */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Tổng tài liệu
            </h3>
            <p className="text-2xl font-bold text-blue-600">--</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Người dùng
            </h3>
            <p className="text-2xl font-bold text-green-600">--</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
              Chờ duyệt
            </h3>
            <p className="text-2xl font-bold text-yellow-600">--</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Báo cáo</h3>
            <p className="text-2xl font-bold text-red-600">--</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
