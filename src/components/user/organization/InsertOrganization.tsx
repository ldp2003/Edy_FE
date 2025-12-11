import React from "react";
import { Form, Input, Button, message } from "antd";
import { OrganizationService } from "../../../utils/OrganizationService";

const InsertOrganization: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: {
    name: string;
    code: string;
    location: string;
    country: string;
    website: string;
  }) => {
    try {
      await OrganizationService.createOrganization({
        name: values.name,
        code: values.code,
        address: values.location, // Map location to address
        country: values.country,
        website: values.website,
      });
      messageApi.success("Tổ chức/Trường đã được thêm thành công!");
    } catch (error) {
      console.error("Error adding organization:", error);
      messageApi.error("Thêm tổ chức/trường thất bại. Vui lòng thử lại.");
    }
  };

  const onFinishFailed = () => {
    messageApi.error("Vui lòng kiểm tra lại thông tin đã nhập.");
  };

  return (
    <div className="bg-white py-6 w-full max-w-md">
      {contextHolder}
      <Form
        name="insertOrganization"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="w-full"
      >
        <Form.Item
          label="Tên trường/Tổ chức"
          name="name"
          rules={[
            { required: true, message: "Vui lòng nhập tên trường/tổ chức!" },
          ]}
        >
          <Input placeholder="Tên trường/Tổ chức" />
        </Form.Item>
        <Form.Item
          label="Code (Tên viết tắt của trường)"
          name="code"
          rules={[{ required: true, message: "Vui lòng nhập code!" }]}
        >
          <Input placeholder="Code" />
        </Form.Item>
        <Form.Item
          label="Vị trí"
          name="location"
          rules={[{ required: true, message: "Vui lòng nhập vị trí!" }]}
        >
          <Input placeholder="Vị trí" />
        </Form.Item>

        <Form.Item
          label="Quốc gia"
          name="country"
          rules={[{ required: true, message: "Vui lòng nhập quốc gia!" }]}
        >
          <Input placeholder="Quốc gia" />
        </Form.Item>

        <Form.Item
          label="Trang web"
          name="website"
          rules={[
            { required: true, message: "Vui lòng nhập trang web!" },
            { type: "url", message: "URL không hợp lệ!" },
          ]}
        >
          <Input placeholder="Trang web" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Thêm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default InsertOrganization;
