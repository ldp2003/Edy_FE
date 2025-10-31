import React from "react";
import { Form, Input, Select, InputNumber } from "antd";

const { Option } = Select;

const DocumentBasicInfo: React.FC = () => {
  return (
    <div className="space-y-4 text-left">
      <Form.Item
        style={{ marginBottom: 13.5 }}
        name="documentName"
        label={<span className="text-xs">Tên tài liệu</span>}
      >
        <Input placeholder="Nhập tên tài liệu" disabled />
      </Form.Item>

      <Form.Item
        style={{ marginBottom: 13.5 }}
        name="subject"
        label={<span className="text-xs">Môn học</span>}
      >
        <Input placeholder="Nhập môn học" disabled />
      </Form.Item>

      <Form.Item
        style={{ marginBottom: 13.5 }}
        name="organization"
        label={<span className="text-xs">Tổ chức</span>}
      >
        <Input placeholder="Tổ chức" disabled />
      </Form.Item>

      <Form.Item
        style={{ marginBottom: 13.5 }}
        name="documentType"
        label={<span className="text-xs">Loại tài liệu</span>}
      >
        <Select placeholder="Loại tài liệu" disabled>
          <Option value="RESEARCH_REPORT">Báo cáo nghiên cứu khoa học</Option>
          <Option value="VIDEO">Video</Option>
          <Option value="STUDY_GUIDE">Đề cương ôn tập</Option>
          <Option value="TEXTBOOK">Giáo trình</Option>
          <Option value="ESSAY">Tiểu luận</Option>
          <Option value="SOLUTION_SET">Bài giải</Option>
          <Option value="THESIS">Luận văn / Khóa luận</Option>
          <Option value="LECTURE">Bài giảng</Option>
          <Option value="OTHER">Khác</Option>
        </Select>
      </Form.Item>

      <div className="grid grid-cols-2 gap-4">
        <Form.Item
          style={{ marginBottom: 13.5 }}
          name="pageCount"
          label={<span className="text-xs">Số trang</span>}
        >
          <InputNumber
            min={1}
            className="w-full"
            placeholder="Số trang"
            style={{ width: "100%" }}
            disabled
          />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 13.5 }}
          name="level"
          label={<span className="text-xs">Trình độ</span>}
        >
          <Select placeholder="Chọn trình độ" disabled>
            <Option value="STUDENT">Học sinh</Option>
            <Option value="UNIVERSITY">Sinh viên (ĐH/CĐ)</Option>
            <Option value="LECTURER">Giảng viên</Option>
            <Option value="RESEARCHER">Nghiên cứu sinh</Option>
            <Option value="OTHER">Khác</Option>
          </Select>
        </Form.Item>
      </div>
    </div>
  );
};

export default DocumentBasicInfo;
