import React from "react";
import { Link } from "react-router-dom";
import logo from "/image/Logo.png";

const UserFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-left px-4 sm:px-6 md:px-12 lg:px-20 bg-white z-1 text-[var(--secondary-text-color)] border-t border-[var(--border-color)]">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center">
                <img
                  src={logo}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="bg-gradient-to-b from-[#50C4FE] to-[#3586DB] bg-clip-text text-transparent font-bold text-lg md:text-xl">
                STUDYSHARE
              </span>
            </div>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
              Nền tảng chia sẻ tài liệu học tập, kết nối cộng đồng học sinh,
              sinh viên Việt Nam.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 md:mb-4 text-xs md:text-sm uppercase tracking-wider">
              Khám Phá
            </h3>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-xs md:text-sm hover:text-blue-400 transition-colors"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/personal-posts"
                  className="text-xs md:text-sm hover:text-blue-400 transition-colors"
                >
                  Tài liệu của tôi
                </Link>
              </li>
              <li>
                <Link
                  to="/favorites"
                  className="text-xs md:text-sm hover:text-blue-400 transition-colors"
                >
                  Yêu thích
                </Link>
              </li>
              <li>
                <Link
                  to="/following"
                  className="text-xs md:text-sm hover:text-blue-400 transition-colors"
                >
                  Danh sách theo dõi
                </Link>
              </li>
              <li>
                <Link
                  to="/history"
                  className="text-xs md:text-sm hover:text-blue-400 transition-colors"
                >
                  Đã xem gần đây
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-3 md:mb-4 text-xs md:text-sm uppercase tracking-wider">
              Tài Nguyên
            </h3>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <Link
                  to="/upload-document"
                  className="text-xs md:text-sm hover:text-blue-400 transition-colors"
                >
                  Đăng tài liệu
                </Link>
              </li>
              <li>
                <Link
                  to="/organizations"
                  className="text-xs md:text-sm hover:text-blue-400 transition-colors"
                >
                  Tổ chức
                </Link>
              </li>
              <li>
                <Link
                  to="/personal-profile"
                  className="text-xs md:text-sm hover:text-blue-400 transition-colors"
                >
                  Hồ sơ của tôi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-3 md:mb-4 text-xs md:text-sm uppercase tracking-wider">
              Liên Hệ
            </h3>
            <ul className="space-y-2 md:space-y-3">
              <li className="text-xs md:text-sm">
                <span>support@gmail.com</span>
              </li>
              <li className="text-xs md:text-sm">
                <span>+84 3333 191 21</span>
              </li>
              <li className="text-xs md:text-sm leading-tight">
                <span>
                  Nguyễn Văn Bảo/12 Đ. Hạnh Thông, Phường, Gò Vấp, Hồ Chí Minh
                  700000
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-6 md:mt-8 pt-4 md:pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4">
          <p className="text-xs md:text-sm text-gray-400 text-center sm:text-left">
            © {currentYear} STUDYSHARE. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-end gap-3 md:gap-6 text-xs md:text-sm">
            <Link to="/about" className="hover:text-blue-400 transition-colors">
              Về chúng tôi
            </Link>
            <Link
              to="/privacy"
              className="hover:text-blue-400 transition-colors"
            >
              Chính sách bảo mật
            </Link>
            <Link to="/terms" className="hover:text-blue-400 transition-colors">
              Điều khoản sử dụng
            </Link>
            <Link to="/help" className="hover:text-blue-400 transition-colors">
              Trợ giúp
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;
