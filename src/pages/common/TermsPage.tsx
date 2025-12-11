import React from "react";

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-10">
            <h1 className="text-3xl font-bold mb-8 text-primary-custom">
              Điều Khoản Sử Dụng
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Cột 1 */}
              <div>
                <div className="prose prose-lg max-w-none text-left">
                  <p className="mb-6 text-secondary-custom">
                    Chào mừng bạn đến với <strong>STUDYSHARE</strong>. Bằng việc
                    truy cập và sử dụng nền tảng của chúng tôi, bạn đồng ý tuân
                    thủ các điều khoản và điều kiện được nêu dưới đây.
                  </p>

                  <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary-custom">
                    Chấp Nhận Điều Khoản
                  </h2>
                  <p className="mb-6 text-secondary-custom">
                    Bằng việc đăng ký tài khoản hoặc sử dụng dịch vụ của chúng
                    tôi, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý với tất cả
                    các điều khoản trong tài liệu này.
                  </p>

                  <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary-custom">
                    Quyền Và Nghĩa Vụ Người Dùng
                  </h2>
                  <h3 className="text-xl font-medium mt-6 mb-3 text-primary-custom">
                    Quyền:
                  </h3>
                  <ul className="list-disc list-inside mb-4 space-y-1 text-secondary-custom">
                    <li>Truy cập và sử dụng tài liệu miễn phí</li>
                    <li>Tải lên và chia sẻ tài liệu của mình</li>
                    <li>Tham gia cộng đồng và tương tác với người dùng khác</li>
                    <li>Nhận hỗ trợ từ đội ngũ quản trị</li>
                  </ul>

                  <h3 className="text-xl font-medium mt-6 mb-3 text-primary-custom">
                    Nghĩa vụ:
                  </h3>
                  <ul className="list-disc list-inside mb-6 space-y-1 text-secondary-custom">
                    <li>Cung cấp thông tin chính xác và cập nhật</li>
                    <li>Tôn trọng quyền sở hữu trí tuệ của người khác</li>
                    <li>Không chia sẻ nội dung vi phạm pháp luật</li>
                    <li>Bảo vệ thông tin đăng nhập của mình</li>
                  </ul>

                  <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary-custom">
                    Nội Dung Và Quyền Sở Hữu Trí Tuệ
                  </h2>
                  <p className="mb-6 text-secondary-custom">
                    Người dùng giữ quyền sở hữu trí tuệ đối với nội dung mà họ
                    tải lên. Tuy nhiên, bằng việc tải lên, bạn cấp cho
                    STUDYSHARE quyền sử dụng nội dung để cung cấp dịch vụ. Bạn
                    cam kết rằng nội dung tải lên không vi phạm quyền của bên
                    thứ ba.
                  </p>
                </div>
              </div>

              {/* Cột 2 */}
              <div>
                <div className="prose prose-lg max-w-none text-left">
                  <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary-custom">
                    Hành Vi Bị Cấm
                  </h2>
                  <ul className="list-disc list-inside mb-6 space-y-2 text-secondary-custom">
                    <li>Tải lên nội dung vi phạm bản quyền</li>
                    <li>Chia sẻ thông tin sai lệch hoặc gây hiểu lầm</li>
                    <li>Lạm dụng hệ thống hoặc cố gắng hack</li>
                    <li>Spam hoặc gửi nội dung không mong muốn</li>
                    <li>Vi phạm quyền riêng tư của người khác</li>
                  </ul>

                  <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary-custom">
                    Chấm Dứt Tài Khoản
                  </h2>
                  <p className="mb-6 text-secondary-custom">
                    Chúng tôi có quyền tạm ngừng hoặc chấm dứt tài khoản của bạn
                    nếu vi phạm các điều khoản này. Trong trường hợp chấm dứt,
                    bạn sẽ mất quyền truy cập vào tất cả dữ liệu và nội dung đã
                    tải lên.
                  </p>

                  <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary-custom">
                    Miễn Trừ Trách Nhiệm
                  </h2>
                  <p className="mb-6 text-secondary-custom">
                    STUDYSHARE không chịu trách nhiệm về tính chính xác của nội
                    dung do người dùng tải lên. Chúng tôi không đảm bảo dịch vụ
                    sẽ luôn khả dụng hoặc không bị gián đoạn.
                  </p>

                  <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary-custom">
                    Thay Đổi Điều Khoản
                  </h2>
                  <p className="text-secondary-custom">
                    Chúng tôi có quyền sửa đổi các điều khoản này bất cứ lúc
                    nào. Thay đổi sẽ có hiệu lực ngay khi được đăng tải trên nền
                    tảng. Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng
                    nghĩa với việc chấp nhận điều khoản mới.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
