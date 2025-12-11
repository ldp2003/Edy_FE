import React from "react";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-10">
            <h1 className="text-3xl font-bold text-center mb-8 text-primary-custom">
              Về Chúng Tôi
            </h1>

            <div className="prose prose-lg max-w-none text-left">
              <p className="text-gray-700 mb-6">
                Chào mừng bạn đến với <strong>STUDYSHARE</strong> - một nền tảng
                đơn giản để chia sẻ tài liệu học tập giữa các bạn học sinh và
                sinh viên Việt Nam.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Chúng Tôi Làm Gì
              </h2>
              <p className="text-gray-700 mb-6">
                STUDYSHARE được tạo ra với mục đích giúp các bạn dễ dàng hơn
                trong việc học tập. Chúng tôi tin rằng việc chia sẻ tài liệu sẽ
                giúp mọi người học tập hiệu quả hơn và đỡ mất thời gian tìm
                kiếm.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Tại Sao Chọn STUDYSHARE
              </h2>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>
                  <strong>Dễ sử dụng:</strong> Giao diện đơn giản, ai cũng có
                  thể dùng được
                </li>
                <li>
                  <strong>Miễn phí:</strong> Không mất phí để tải lên hoặc tải
                  xuống tài liệu
                </li>
                <li>
                  <strong>Cộng đồng:</strong> Kết nối với hàng nghìn bạn học
                  sinh, sinh viên
                </li>
                <li>
                  <strong>An toàn:</strong> Chúng tôi kiểm duyệt tài liệu để đảm
                  bảo chất lượng
                </li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Lời Cảm Ơn
              </h2>
              <p className="text-gray-700 mb-6">
                Cảm ơn bạn đã sử dụng STUDYSHARE. Chúng tôi luôn cố gắng cải
                thiện nền tảng để phục vụ bạn tốt hơn. Nếu bạn có góp ý gì, hãy
                cho chúng tôi biết nhé!
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Liên Hệ Với Chúng Tôi
              </h2>
              <p className="text-gray-700">
                Có câu hỏi hoặc cần hỗ trợ? Gửi email cho chúng tôi tại:
                support@studyshare.vn
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
