import React from "react";

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-10">
            <h1 className="text-3xl font-bold text-center mb-8 text-primary-custom">
              Chính Sách Bảo Mật
            </h1>

            <div className="prose prose-lg max-w-none text-left">
              <p className="text-gray-700 mb-6">
                Chính sách bảo mật này mô tả cách <strong>STUDYSHARE</strong>{" "}
                thu thập, sử dụng và bảo vệ thông tin của bạn khi sử dụng nền
                tảng của chúng tôi.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Thông Tin Chúng Tôi Thu Thập
              </h2>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Thông tin cá nhân: Tên, email, thông tin tổ chức</li>
                <li>Dữ liệu sử dụng: Lịch sử truy cập, tài liệu đã xem</li>
                <li>Thông tin thiết bị: Địa chỉ IP, loại trình duyệt</li>
                <li>Nội dung tải lên: Tài liệu và thông tin liên quan</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Cách Chúng Tôi Sử Dụng Thông Tin
              </h2>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Cung cấp và cải thiện dịch vụ</li>
                <li>Gửi thông báo và cập nhật quan trọng</li>
                <li>Ngăn chặn lạm dụng và bảo vệ nền tảng</li>
                <li>Phân tích và cải thiện trải nghiệm người dùng</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Chia Sẻ Thông Tin
              </h2>
              <p className="text-gray-700 mb-6">
                Chúng tôi cam kết không bán, trao đổi hoặc cho thuê thông tin cá
                nhân của bạn cho bên thứ ba. Thông tin chỉ được chia sẻ trong
                các trường hợp sau:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Với sự đồng ý của bạn</li>
                <li>Để tuân thủ pháp luật</li>
                <li>Để bảo vệ quyền lợi và an toàn của người dùng</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Bảo Mật Dữ Liệu
              </h2>
              <p className="text-gray-700 mb-6">
                Chúng tôi áp dụng các biện pháp bảo mật tiên tiến để bảo vệ
                thông tin của bạn, bao gồm mã hóa dữ liệu, kiểm soát truy cập và
                giám sát liên tục.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Quyền Của Bạn
              </h2>
              <p className="text-gray-700 mb-6">
                Bạn có quyền truy cập, chỉnh sửa hoặc xóa thông tin cá nhân của
                mình. Để thực hiện các quyền này, vui lòng liên hệ với chúng
                tôi.
              </p>

              <p className="text-gray-700 mt-8">
                Chính sách này có thể được cập nhật theo thời gian. Chúng tôi sẽ
                thông báo về các thay đổi quan trọng qua email hoặc thông báo
                trên nền tảng.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
