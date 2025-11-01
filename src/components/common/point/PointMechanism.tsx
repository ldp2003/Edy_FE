import React from "react";

interface PointMechanismProps {
  onViewMore?: () => void;
}

const PointMechanism: React.FC<PointMechanismProps> = ({ onViewMore }) => {
  const earnData = [
    { action: "Tạo tài khoản lần đầu", points: "+5 điểm" },
    { action: "Tài liệu đầu tiên được duyệt công khai", points: "+20 điểm" },
    {
      action: "Tài liệu được duyệt công khai (Không tính tài liệu đầu tiên)",
      points: "+15 điểm",
    },
    { action: "Đánh giá tài liệu", points: "+1 điểm / mỗi tài liệu" },
  ];

  const spendData = [
    { action: "Tải tài liệu phổ thông", points: "-4 điểm" },
    { action: "Tải tài liệu chuyên sâu / khan hiếm", points: "-6 điểm" },
    { action: "Dùng AI tóm tắt tài liệu", points: "-1 điểm" },
  ];

  const penaltyData = [
    {
      reason: "Bị phát hiện vi phạm bản quyền (COPYRIGHT)",
      points: "-10 điểm hạng",
    },
    {
      reason: "Bị phát spam bình luận, bài viết (SPAM)",
      points: "-5 điểm hạng",
    },
    {
      reason: "Nội dung không phù hợp (INAPPROPRIATE)",
      points: "-10 điểm hạng",
    },
    { reason: "Bị cảnh cáo lần đầu", points: "-4 điểm hạng" },
    { reason: "Bị cảnh cáo các lần sau", points: "-10 điểm hạng mỗi lần" },
    { reason: "Bị cảnh cáo lần thứ 5", points: "-20 điểm hạng" },
    {
      reason: "Bị cảnh báo hơn 10 lần",
      points: "Khóa tài khoản vĩnh viễn và trừ hết điểm",
    },
  ];

  return (
    <div className="p-4 bg-white w-full rounded-md text-left shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm md:text-base font-semibold text-[var(--primary-text-color)]">
          Cơ chế tích tiêu điểm
        </h3>
        {onViewMore && (
          <button
            onClick={onViewMore}
            className="text-xs md:text-sm text-[var(--link-color)] hover:underline cursor-pointer"
          >
            Xem thêm &gt;
          </button>
        )}
      </div>

      <div className="mb-6 p-4 bg-[var(--field-background-color)] rounded-md border-l-4 border-[var(--primary-color)]">
        <p className="text-xs md:text-sm text-[var(--third-text-color)] leading-relaxed">
          Cơ chế tích điểm cho phép người dùng tích điểm của bản thân khi đăng
          tải 1 tài liệu lên hệ thống. Số điểm này có thể dùng để quy đổi thành
          số lần tải tài liệu.
        </p>
        <p className="text-xs md:text-sm text-[var(--third-text-color)] leading-relaxed mt-2">
          Khi tích điểm người dùng sẽ có 2 nguồn điểm:{" "}
          <strong className="text-[var(--primary-color)]">
            Điểm tiêu dùng
          </strong>{" "}
          và <strong className="text-[var(--primary-color)]">điểm hạng</strong>
        </p>
        <p className="text-xs md:text-sm text-[var(--third-text-color)] leading-relaxed mt-2">
          Điểm hạng là tổng điểm người dùng có khi đăng tải tài liệu. Khi tổng
          điểm hạng tích được vượt qua cột mốc chỉ định sẽ được thăng lên làm
          thành viên VIP với nhiều ưu đãi hơn.
        </p>
      </div>

      <div className="space-y-4 md:space-y-6">
        {/* Tích điểm */}
        <div>
          <h4 className="text-xs md:text-sm font-semibold text-green-600 mb-2">
            Tích điểm
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 text-[var(--secondary-text-color)] min-w-[200px]">
                    Hành động
                  </th>
                  <th className="text-left py-2 text-[var(--secondary-text-color)] min-w-[100px]">
                    Điểm thưởng
                  </th>
                </tr>
              </thead>
              <tbody>
                {earnData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2 text-[var(--third-text-color)] pr-4">
                      {item.action}
                    </td>
                    <td className="py-2 text-green-600 font-semibold">
                      {item.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dùng điểm */}
        <div>
          <h4 className="text-xs md:text-sm font-semibold text-blue-600 mb-2">
            Dùng điểm
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 text-[var(--secondary-text-color)] min-w-[200px]">
                    Hành động
                  </th>
                  <th className="text-left py-2 text-[var(--secondary-text-color)] min-w-[100px]">
                    Điểm trừ
                  </th>
                </tr>
              </thead>
              <tbody>
                {spendData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2 text-[var(--third-text-color)] pr-4">
                      {item.action}
                    </td>
                    <td className="py-2 text-red-600 font-semibold">
                      {item.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Điểm trừ */}
        <div>
          <h4 className="text-xs md:text-sm font-semibold text-red-600 mb-2">
            Điểm trừ
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 text-[var(--secondary-text-color)] min-w-[200px]">
                    Nguyên nhân
                  </th>
                  <th className="text-left py-2 text-[var(--secondary-text-color)] min-w-[100px]">
                    Điểm trừ
                  </th>
                </tr>
              </thead>
              <tbody>
                {penaltyData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2 text-[var(--third-text-color)] pr-4">
                      {item.reason}
                    </td>
                    <td className="py-2 text-red-600 font-semibold">
                      {item.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cơ chế cảnh cáo (Strike) */}
        <div>
          <h4 className="text-xs md:text-sm font-semibold text-orange-600 mb-2">
            Cơ chế cảnh cáo (Strike)
          </h4>

          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
            <p className="text-xs md:text-sm text-[var(--third-text-color)] mb-2">
              <strong>Khi nào nhận cảnh cáo:</strong> Khi quản trị viên nhận
              được báo cáo hoặc phát hiện người dùng có hành vi bất thường như:
            </p>
            <ul className="text-xs md:text-sm text-[var(--third-text-color)] list-disc list-inside space-y-1 ml-4">
              <li>Đăng tài liệu vi phạm bản quyền</li>
              <li>Đăng nội dung không phù hợp (bạo lực, spam)</li>
              <li>Spam tài liệu rác để câu điểm/like</li>
              <li>Báo cáo sai sự thật nhiều lần (false report)</li>
            </ul>
            <p className="text-xs md:text-sm text-[var(--third-text-color)] mt-2">
              ⇒ Quản trị viên có thể gửi cảnh cáo và trừ điểm hạng (rank_point),
              tăng cảnh cáo lên (strike). Tùy vào strike, tài khoản có thể bị
              hạn chế.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 text-[var(--secondary-text-color)] min-w-[150px]">
                    Số cảnh cáo
                  </th>
                  <th className="text-left py-2 text-[var(--secondary-text-color)] min-w-[250px]">
                    Hậu quả
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-[var(--third-text-color)] font-semibold">
                    1 cảnh cáo
                  </td>
                  <td className="py-2 text-orange-600">Cảnh báo nhẹ</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-[var(--third-text-color)] font-semibold">
                    3 cảnh cáo
                  </td>
                  <td className="py-2 text-red-600">
                    Hạn chế quyền (không được đăng tải, bình luận, tải tài liệu)
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-[var(--third-text-color)] font-semibold">
                    5 cảnh cáo
                  </td>
                  <td className="py-2 text-red-600 font-semibold">
                    Khóa tài khoản tạm thời
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-[var(--third-text-color)] font-semibold">
                    &gt;10 cảnh cáo
                  </td>
                  <td className="py-2 text-red-700 font-semibold">
                    Cấm vĩnh viễn
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs md:text-sm text-blue-800">
              <strong>Lưu ý:</strong> Sau 60 ngày không phát hiện vi phạm, tài
              khoản còn hoạt động và không bị khóa tạm thời sẽ được giảm 1
              strike.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointMechanism;
