import React from "react";
import { Link } from "react-router-dom";
import logo from "/public/image/Logo.png";

const AdminFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-6 text-left px-4 md:px-20 bg-white text-[var(--secondary-text-color)] border-t border-[var(--border-color)]">
      <div className="container mx-auto px-2 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <img src={logo} alt="Logo" />
              </div>
              <span className="bg-gradient-to-b from-[#50C4FE] to-[#3586DB] bg-clip-text text-transparent font-bold text-xl">
                Edy Admin
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Hệ thống quản trị tài liệu học tập hiện đại, giúp quản lý và theo
              dõi hiệu quả.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Quản Lý
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/admin"
                  className="text-sm hover:text-blue-400 transition-colors"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/documents/all"
                  className="text-sm hover:text-blue-400 transition-colors"
                >
                  Tài liệu
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/users"
                  className="text-sm hover:text-blue-400 transition-colors"
                >
                  Người dùng
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/reports"
                  className="text-sm hover:text-blue-400 transition-colors"
                >
                  Báo cáo
                </Link>
              </li>
            </ul>
          </div>

          {/* Statistics Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Thống Kê
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/admin/statistics/documents"
                  className="text-sm hover:text-blue-400 transition-colors"
                >
                  Thống kê tài liệu
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/statistics/users"
                  className="text-sm hover:text-blue-400 transition-colors"
                >
                  Thống kê người dùng
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/statistics/general"
                  className="text-sm hover:text-blue-400 transition-colors"
                >
                  Thống kê chung
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/users/manage-roles"
                  className="text-sm hover:text-blue-400 transition-colors"
                >
                  Quản lý quyền
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Liên Hệ
            </h3>
            <ul className="space-y-3">
              <li className="text-sm">
                <span>admin@edy.edu.vn</span>
              </li>
              <li className="text-sm">
                <span>+84 123 456 789</span>
              </li>
              <li className="text-sm">
                <span>
                  Nguyễn Văn Bảo/12 Đ. Hạnh Thông, Phường, Gò Vấp, Hồ Chí Minh
                  700000
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {currentYear} Edy Admin. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              to="/privacy"
              className="hover:text-blue-400 transition-colors"
            >
              Chính sách bảo mật
            </Link>
            <Link to="/terms" className="hover:text-blue-400 transition-colors">
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
