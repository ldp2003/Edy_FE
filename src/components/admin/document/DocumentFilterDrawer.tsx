import React from "react";
import { Drawer, Select, Button, Input } from "antd";

const { Option } = Select;

interface DocumentFilterDrawerProps {
  visible: boolean;
  onClose: () => void;
  onFilterChange?: (filters: Record<string, unknown>) => void;
}

const DocumentFilterDrawer: React.FC<DocumentFilterDrawerProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Drawer
      title="Bộ lọc tài liệu"
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
      footer={
        <div className="flex justify-between">
          <Button onClick={onClose}>Đóng</Button>
          <Button type="primary" className="bg-blue-500 hover:bg-blue-600">
            Áp dụng bộ lọc
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loại tài liệu:
          </label>
          <Select
            placeholder="Nghiên cứu khoa học"
            className="w-full"
            size="small"
          >
            <Option value="research">Nghiên cứu khoa học</Option>
            <Option value="teaching">Giảng dạy</Option>
            <Option value="thesis">Luận văn</Option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trình độ:
          </label>
          <Select placeholder="Đại học" className="w-full" size="small">
            <Option value="university">Đại học</Option>
            <Option value="master">Thạc sĩ</Option>
            <Option value="phd">Tiến sĩ</Option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tổ chức:
          </label>
          <Select
            placeholder="Đại học Công nghiệp Thành phố Hồ Chí Minh"
            className="w-full"
            size="small"
          >
            <Option value="iuh">Đại học Công nghiệp TP.HCM</Option>
            <Option value="hcmus">Đại học Khoa học Tự nhiên</Option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên tài liệu:
          </label>
          <Input placeholder="Nhập tên tài liệu..." size="small" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên tác giả:
          </label>
          <Input placeholder="Nhập tên tác giả..." size="small" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lượt xem:
          </label>
          <div className="flex items-center space-x-2">
            <Input placeholder="3" size="small" className="flex-1" />
            <span className="text-gray-500">-</span>
            <Input placeholder="3" size="small" className="flex-1" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lượt tải:
          </label>
          <div className="flex items-center space-x-2">
            <Input placeholder="3" size="small" className="flex-1" />
            <span className="text-gray-500">-</span>
            <Input placeholder="3" size="small" className="flex-1" />
          </div>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" />
            <span className="text-sm font-medium text-gray-700">
              Chuyên sâu
            </span>
          </label>
        </div>
      </div>
    </Drawer>
  );
};

export default DocumentFilterDrawer;
