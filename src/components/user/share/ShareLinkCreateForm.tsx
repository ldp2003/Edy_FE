import React from "react";
import { Input, Select, Button, Checkbox, DatePicker } from "antd";
import { Plus, Users, Clock } from "lucide-react";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;

interface ShareLinkCreateFormProps {
  linkName: string;
  maxUsers: number;
  requiresRequest: boolean;
  timeLimited: boolean;
  dateRange: [dayjs.Dayjs | null, dayjs.Dayjs | null];
  loading: boolean;
  onLinkNameChange: (value: string) => void;
  onMaxUsersChange: (value: number) => void;
  onRequiresRequestChange: (checked: boolean) => void;
  onTimeLimitedChange: (checked: boolean) => void;
  onDateRangeChange: (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null]) => void;
  onCreateLink: () => void;
}

const ShareLinkCreateForm: React.FC<ShareLinkCreateFormProps> = ({
  linkName,
  maxUsers,
  requiresRequest,
  timeLimited,
  dateRange,
  loading,
  onLinkNameChange,
  onMaxUsersChange,
  onRequiresRequestChange,
  onTimeLimitedChange,
  onDateRangeChange,
  onCreateLink,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tên link chia sẻ *
        </label>
        <Input
          placeholder="Nhập tên cho link chia sẻ (vd: Link cho nhóm A)"
          value={linkName}
          onChange={(e) => onLinkNameChange(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users size={16} className="inline mr-1" />
            Giới hạn người dùng
          </label>
          <Select
            value={maxUsers}
            onChange={onMaxUsersChange}
            className="w-full"
          >
            <Option value={-1}>Không giới hạn</Option>
            <Option value={1}>1 người</Option>
            <Option value={5}>5 người</Option>
            <Option value={10}>10 người</Option>
            <Option value={20}>20 người</Option>
            <Option value={50}>50 người</Option>
            <Option value={100}>100 người</Option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock size={16} className="inline mr-1" />
            Giới hạn thời gian
          </label>
          <Checkbox
            checked={timeLimited}
            onChange={(e) => onTimeLimitedChange(e.target.checked)}
          >
            Có giới hạn thời gian
          </Checkbox>
        </div>
      </div>

      {timeLimited && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thời gian hiệu lực
          </label>
          <RangePicker
            showTime
            value={dateRange}
            onChange={(dates) => onDateRangeChange(dates || [null, null])}
            className="w-full"
            placeholder={["Thời gian bắt đầu", "Thời gian kết thúc"]}
          />
        </div>
      )}

      <div>
        <Checkbox
          checked={requiresRequest}
          onChange={(e) => onRequiresRequestChange(e.target.checked)}
        >
          <span className="text-sm font-medium">
            Yêu cầu phê duyệt trước khi truy cập
          </span>
        </Checkbox>
        {requiresRequest && (
          <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
            💡 Người dùng sẽ phải gửi yêu cầu và được bạn phê duyệt trước khi có
            thể truy cập tài liệu
          </div>
        )}
      </div>

      <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
        <p className="mb-2">
          <strong>Lưu ý:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Link sẽ tự động hết hạn sau thời gian đã chọn (nếu có)</li>
          <li>Chỉ số lượng người dùng được phép mới có thể truy cập</li>
          <li>Bạn có thể quản lý và thu hồi quyền truy cập bất cứ lúc nào</li>
        </ul>
      </div>

      <Button
        type="primary"
        icon={<Plus size={16} />}
        onClick={onCreateLink}
        className="w-full"
        disabled={!linkName.trim()}
        loading={loading}
      >
        Tạo Link Chia Sẻ
      </Button>
    </div>
  );
};

export default ShareLinkCreateForm;
