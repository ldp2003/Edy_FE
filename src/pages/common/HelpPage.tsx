import React from "react";

const HelpPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-10">
            <h1 className="text-3xl font-bold text-center mb-8 text-primary-custom">
              Trung Tâm Trợ Giúp
            </h1>

            <div className="prose prose-lg max-w-none text-left">
              <p className="text-gray-700 mb-6">
                Chào mừng bạn đến với Trung tâm Trợ giúp của{" "}
                <strong>STUDYSHARE</strong>. Tại đây, bạn sẽ tìm thấy các hướng
                dẫn chi tiết để sử dụng nền tảng một cách hiệu quả nhất.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Bắt Đầu Sử Dụng
              </h2>
              <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">
                Đăng Ký Tài Khoản
              </h3>
              <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-1">
                <li>Truy cập trang đăng ký</li>
                <li>Nhập thông tin cá nhân đầy đủ</li>
                <li>Xác nhận email để kích hoạt tài khoản</li>
                <li>Đăng nhập và bắt đầu sử dụng</li>
              </ol>

              <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">
                Tải Lên Tài Liệu
              </h3>
              <ol className="list-decimal list-inside text-gray-700 mb-6 space-y-1">
                <li>Đăng nhập vào tài khoản</li>
                <li>Chọn "Tải lên" từ menu</li>
                <li>Chọn file từ thiết bị của bạn</li>
                <li>Thêm thông tin mô tả và thẻ</li>
                <li>Nhấn "Tải lên" để hoàn thành</li>
              </ol>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Tìm Kiếm Và Tải Xuống Tài Liệu
              </h2>
              <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">
                Tìm Kiếm Tài Liệu
              </h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Sử dụng thanh tìm kiếm ở đầu trang</li>
                <li>Lọc theo môn học, loại tài liệu, hoặc trường</li>
                <li>Sử dụng bộ lọc nâng cao để tìm chính xác hơn</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">
                Tải Xuống Tài Liệu
              </h3>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
                <li>Nhấn vào tài liệu muốn tải</li>
                <li>Nhấn nút "Tải xuống" hoặc "Xem"</li>
                <li>Đợi quá trình tải hoàn tất</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Quản Lý Tài Khoản
              </h2>
              <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">
                Chỉnh Sửa Thông Tin Cá Nhân
              </h3>
              <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-1">
                <li>Vào phần "Cài đặt tài khoản"</li>
                <li>Chọn "Chỉnh sửa thông tin"</li>
                <li>Cập nhật thông tin cần thiết</li>
                <li>Lưu thay đổi</li>
              </ol>

              <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">
                Đổi Mật Khẩu
              </h3>
              <ol className="list-decimal list-inside text-gray-700 mb-6 space-y-1">
                <li>Vào phần "Cài đặt tài khoản"</li>
                <li>Chọn "Đổi mật khẩu"</li>
                <li>Nhập mật khẩu cũ và mật khẩu mới</li>
                <li>Xác nhận thay đổi</li>
              </ol>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Tương Tác Với Cộng Đồng
              </h2>
              <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">
                Theo Dõi Người Dùng Khác
              </h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Vào trang cá nhân của người dùng</li>
                <li>Nhấn nút "Theo dõi"</li>
                <li>Xem các cập nhật từ họ trong feed</li>
              </ul>

              <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">
                Bình Luận Và Đánh Giá
              </h3>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
                <li>Mở tài liệu muốn bình luận</li>
                <li>Cuộn xuống phần bình luận</li>
                <li>Viết bình luận hoặc đánh giá sao</li>
                <li>Nhấn "Gửi" để đăng</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Báo Cáo Vấn Đề
              </h2>
              <p className="text-gray-700 mb-4">
                Nếu bạn gặp phải vấn đề kỹ thuật hoặc cần hỗ trợ thêm, vui lòng
                liên hệ với chúng tôi qua:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
                <li>Email: support@studyshare.edu.vn</li>
                <li>Forum cộng đồng trong ứng dụng</li>
                <li>Chat trực tiếp (nếu có)</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Mẹo Và Thủ Thuật
              </h2>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Sử dụng thẻ (tags) để dễ dàng tìm kiếm tài liệu</li>
                <li>Lưu tài liệu yêu thích để truy cập nhanh</li>
                <li>Tham gia nhóm học tập để kết nối với bạn bè</li>
                <li>Kiểm tra thông báo thường xuyên để không bỏ lỡ cập nhật</li>
              </ul>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Lưu ý:</strong> Trung tâm trợ giúp này được cập
                      nhật thường xuyên. Nếu bạn không tìm thấy câu trả lời cho
                      câu hỏi của mình, hãy liên hệ trực tiếp với đội ngũ hỗ
                      trợ.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
