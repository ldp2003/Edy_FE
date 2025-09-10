import React from "react";

const LoginForm: React.FC = () => {
  return (
      <div className="bg-white p-6 w-full  text-center">
        <h2 className="text-2xl mb-4">Đăng Nhập</h2>
        <p className="text-sm mb-4">Nhập email hoặc số điện thoại</p>
        <input
          type="text"
          placeholder="Email"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Đăng Nhập
        </button>
        <p className="text-sm mt-2 text-blue-500 cursor-pointer">
          Quên mật khẩu?
        </p>
      </div>
  );
};

export default LoginForm;
