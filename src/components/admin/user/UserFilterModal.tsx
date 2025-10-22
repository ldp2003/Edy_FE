import React, { useState, useEffect } from "react";
import { Modal, Form, Select, Button, Input } from "antd";
import { OrganizationService } from "../../../utils/OrganizationService";

const { Option } = Select;

interface FilterValues {
  status?: string;
  organization?: string;
  organizationName?: string;
  field_of_study?: string[];
  point_range?: [number, number];
  strike_range?: [number, number];
}

interface UserFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
  initialFilters?: FilterValues;
  isInDrawer?: boolean; // New prop to control rendering mode
}

interface Organization {
  _id: string;
  name: string;
}

const UserFilterModal: React.FC<UserFilterModalProps> = ({
  visible,
  onClose,
  onApply,
  initialFilters = {},
  isInDrawer = false,
}) => {
  const [form] = Form.useForm();
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    if (visible) {
      fetchFilterData();
      form.setFieldsValue(initialFilters);
    }
  }, [visible, initialFilters, form]);

  const fetchFilterData = async () => {
    try {
      const orgResponse = await OrganizationService.getOrganizations();
      setOrganizations(
        (orgResponse || []).map((org) => ({
          _id: org._id || "",
          name: org.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching filter data:", error);
    }
  };

  const handleApply = () => {
    form.validateFields().then((values) => {
      // Add organization name to the values
      const orgName = values.organization
        ? organizations.find((org) => org._id === values.organization)?.name
        : undefined;
      const filtersWithName = {
        ...values,
        organizationName: orgName,
      };
      onApply(filtersWithName);
      if (!isInDrawer) {
        onClose();
      }
    });
  };

  const handleReset = () => {
    form.resetFields();
    onApply({});
    if (!isInDrawer) {
      onClose();
    }
  };

  const filterContent = (
    <Form form={form} layout="vertical">
      <Form.Item name="status" label="Trạng thái">
        <Select placeholder="Chọn trạng thái" allowClear>
          <Option value="ACTIVE">Hoạt động</Option>
          <Option value="INACTIVE">Không hoạt động</Option>
          <Option value="BANNED">Bị khóa</Option>
        </Select>
      </Form.Item>

      <Form.Item name="organization" label="Tổ chức">
        <Select
          placeholder="Chọn tổ chức"
          allowClear
          showSearch
          optionFilterProp="children"
        >
          {organizations.map((org) => (
            <Option key={org._id} value={org._id}>
              {org.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="point_range" label="Điểm (từ - đến)">
        <Input.Group compact>
          <Form.Item name={["point_range", 0]} noStyle>
            <Input style={{ width: "45%" }} placeholder="Từ" type="number" />
          </Form.Item>
          <Input
            style={{
              width: "10%",
              borderLeft: 0,
              borderRight: 0,
              pointerEvents: "none",
              backgroundColor: "#fff",
            }}
            placeholder="~"
            disabled
          />
          <Form.Item name={["point_range", 1]} noStyle>
            <Input style={{ width: "45%" }} placeholder="Đến" type="number" />
          </Form.Item>
        </Input.Group>
      </Form.Item>

      <Form.Item name="strike_range" label="Strike (từ - đến)">
        <Input.Group compact>
          <Form.Item name={["strike_range", 0]} noStyle>
            <Input style={{ width: "45%" }} placeholder="Từ" type="number" />
          </Form.Item>
          <Input
            style={{
              width: "10%",
              borderLeft: 0,
              borderRight: 0,
              pointerEvents: "none",
              backgroundColor: "#fff",
            }}
            placeholder="~"
            disabled
          />
          <Form.Item name={["strike_range", 1]} noStyle>
            <Input style={{ width: "45%" }} placeholder="Đến" type="number" />
          </Form.Item>
        </Input.Group>
      </Form.Item>

      <Form.Item>
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
        >
          <Button onClick={handleReset}>Đặt lại</Button>
          <Button type="primary" onClick={handleApply}>
            Áp dụng
          </Button>
        </div>
      </Form.Item>
    </Form>
  );

  if (isInDrawer) {
    return filterContent;
  }

  return (
    <Modal
      title="Bộ lọc nâng cao"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="reset" onClick={handleReset}>
          Đặt lại
        </Button>,
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="apply" type="primary" onClick={handleApply}>
          Áp dụng
        </Button>,
      ]}
      width={600}
    >
      {filterContent}
    </Modal>
  );
};

export default UserFilterModal;
