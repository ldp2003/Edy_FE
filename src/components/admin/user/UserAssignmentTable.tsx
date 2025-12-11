/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Table, Button, message, Popconfirm, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Edit, Lock, Unlock, Plus } from "lucide-react";
import { AssignmentService } from "../../../utils/AssignmentService";
import { NotificationService } from "../../../utils/NotificationService";
import { ROLE_DISPLAY_NAMES } from "../../../constants/RoleConstants";
import { getStatusStyle } from "../../../utils/AdminTableStyles";
import EditAssignmentModel from "../role/EditAssigmentModel";
import AssignRoleModal from "../role/AssignRoleModal";

interface Assignment {
  _id: string;
  account: {
    _id: string;
    user: {
      _id: string;
      fullname: string;
      avatar: string;
    };
  };
  role: {
    _id: string;
    name: string;
    is_active: boolean;
  };
  subject?: {
    _id: string;
    name: string;
  };
  organization?: {
    _id: string;
    name: string;
  };
  is_active: boolean;
}

interface UserAssignmentTableProps {
  userId: string;
}

const UserAssignmentTable: React.FC<UserAssignmentTableProps> = ({
  userId,
}) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await AssignmentService.getAllAssignments();
      // console.log("All assignments data:", response);

      // Find the user's assignments from grouped data
      const userGroup = response.find(
        (group: any) => group.account.user.id === userId
      );

      // console.log("User group found:", userGroup);

      if (userGroup && userGroup.assignments) {
        setAssignments(userGroup.assignments);
        setSelectedAccount(userGroup.account);
      } else {
        setAssignments([]);
        setSelectedAccount(null);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      messageApi.error("Không thể tải danh sách phân quyền");
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAssignments();
    }
  }, [userId]);

  const handleToggleStatus = async (
    assignmentId: string,
    currentStatus: boolean
  ) => {
    try {
      await AssignmentService.updateAssignmentStatus(
        assignmentId,
        !currentStatus
      );

      // Send notification to user
      const messageText = currentStatus
        ? "Vai trò của bạn đã bị vô hiệu hóa."
        : "Vai trò của bạn đã được kích hoạt lại.";

      try {
        await NotificationService.createSystemNotification(userId, messageText);
      } catch (notifError) {
        console.error("Error sending notification:", notifError);
      }

      messageApi.success("Cập nhật trạng thái thành công");
      fetchAssignments();
    } catch (error: any) {
      messageApi.error(
        error.response?.data?.message || "Không thể cập nhật trạng thái"
      );
    }
  };

  const columns: ColumnsType<Assignment> = [
    {
      title: "Vai trò",
      key: "role",
      render: (_, record) => (
        <span className="font-medium">
          {ROLE_DISPLAY_NAMES[record.role.name] || record.role.name}
        </span>
      ),
    },
    {
      title: "Tổ chức",
      key: "organization",
      render: (_, record) => <span>{record.organization?.name || "-"}</span>,
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 120,
      align: "center",
      render: (_, record) => (
        <span
          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
          style={getStatusStyle(record.is_active ? "active" : "banned")}
        >
          {record.is_active ? "Đang hoạt động" : "Đã vô hiệu"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<Edit size={14} />}
            onClick={() => {
              setSelectedAssignment(record);
              setIsEditModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title={`Bạn có chắc muốn ${
              record.is_active ? "vô hiệu" : "kích hoạt"
            } phân quyền này?`}
            onConfirm={() => handleToggleStatus(record._id, record.is_active)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button
              size="small"
              icon={
                record.is_active ? <Lock size={14} /> : <Unlock size={14} />
              }
              type={record.is_active ? "default" : "primary"}
            >
              {record.is_active ? "Vô hiệu" : "Kích hoạt"}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-[var(--primary-text-color)]">
            Danh sách quyền
          </h3>
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => setIsAssignModalVisible(true)}
          >
            Thêm vai trò
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={assignments}
          rowKey="_id"
          loading={loading}
          pagination={false}
          size="small"
        />

        <EditAssignmentModel
          visible={isEditModalVisible}
          onCancel={() => {
            setIsEditModalVisible(false);
            setSelectedAssignment(null);
          }}
          onSuccess={() => {
            setIsEditModalVisible(false);
            setSelectedAssignment(null);
            fetchAssignments();
          }}
          assignment={selectedAssignment}
        />

        <AssignRoleModal
          visible={isAssignModalVisible}
          onCancel={() => setIsAssignModalVisible(false)}
          onSuccess={() => {
            setIsAssignModalVisible(false);
            fetchAssignments();
          }}
          selectedAccount={selectedAccount}
        />
      </div>
    </>
  );
};

export default UserAssignmentTable;
