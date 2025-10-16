import React from "react";
import { Form, Input, Select, Space, Button } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { REPORT_TYPE_OPTIONS, REPORT_STATUS_OPTIONS } from "../../../utils/reportTypeUtils";

export interface AdminReportFilterParams {
  search?: string;
  status?: string;
  type?: string;
}

interface AdminReportFilterSearchProps {
  onFilterChange: (filters: AdminReportFilterParams) => void;
  loading?: boolean;
  initialFilters?: AdminReportFilterParams;
}

const AdminReportFilterSearch: React.FC<AdminReportFilterSearchProps> = ({
  onFilterChange,
  loading,
  initialFilters,
}) => {
  const [form] = Form.useForm();

  const handleReset = () => {
    // Reset form về giá trị mặc định
    const defaultValues = {
      search: "",
      status: "PROCESSING",
      type: "",
    };
    
    form.setFieldsValue(defaultValues);
    onFilterChange(defaultValues);
  };

  return (
    <Form
      form={form}
      layout="inline"
      className="mb-6 gap-4"
      initialValues={initialFilters}
      onValuesChange={(_, allValues) => onFilterChange(allValues)}
    >
      <Form.Item name="search" className="flex-1">
        <Input
          placeholder="Tìm kiếm theo tiêu đề"
          prefix={<SearchOutlined className="text-gray-400" />}
          allowClear
        />
      </Form.Item>

      <Form.Item name="status">
        <Select
          placeholder="Trạng thái"
          style={{ width: 160 }}
          options={REPORT_STATUS_OPTIONS}
          allowClear
        />
      </Form.Item>

      <Form.Item name="type">
        <Select
          placeholder="Loại vi phạm"
          style={{ width: 180 }}
          options={REPORT_TYPE_OPTIONS}
          allowClear
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleReset}
            loading={loading}
          >
            Đặt lại
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AdminReportFilterSearch;