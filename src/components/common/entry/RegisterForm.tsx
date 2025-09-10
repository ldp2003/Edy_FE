import React from "react";

const RegisterForm: React.FC = () => {
  return (
    <div className="bg-white p-6 w-full  text-center">
      <h2 className="text-2xl mb-4">Đăng Ký</h2>
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
      <input
        type="password"
        placeholder="Xác nhận mật khẩu"
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <button className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Đăng Ký
      </button>
    </div>
  );
};

export default RegisterForm;
