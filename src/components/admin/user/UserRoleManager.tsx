/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Tag, message, Popconfirm, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Edit, Plus, Lock, Unlock, UserX } from "lucide-react";
import EditAssignmentModel from "../role/EditAssigmentModel";
import AssignRoleModal from "../role/AssignRoleModal";
import { AssignmentService } from "../../../utils/AssignmentService";
import { NotificationService } from "../../../utils/NotificationService";
import type { User } from "../../../models/user";
import type { Assignment } from "../../../models/assignment";

interface UserRoleManagerProps {
  userId: string;
  currentRole?: string;
  onRoleChange?: (newRole: string) => void;
  user: User;
}

const UserRoleManager: React.FC<UserRoleManagerProps> = ({ userId, user }) => {
  const [loading, setLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [userAssignments, setUserAssignments] = useState<Assignment[]>([]);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch assignments data
  const fetchAssignments = useCallback(async () => {
    try {
      setRolesLoading(true);
      const response = await AssignmentService.getAllAssignments();
      const assignments = response || [];
      const filteredAssignments = assignments.filter(
        (assignment: Assignment) => assignment.account.user._id === userId
      );
      setUserAssignments(filteredAssignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      message.error("Không thể tải danh sách phân quyền!");
      setUserAssignments([]);
    } finally {
      setRolesLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchAssignments();
    }
  }, [userId, fetchAssignments]);

  const handleEditAssignment = (record: Assignment) => {
    setSelectedAssignment(record);
    setEditModalVisible(true);
  };

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
      const assignment = userAssignments.find((a) => a._id === assignmentId);
      if (assignment) {
        const userId = assignment.account.user._id;
        if (userId) {
          const messageText = currentStatus
            ? "Vai trò của bạn đã bị vô hiệu hóa."
            : "Vai trò của bạn đã được kích hoạt lại.";
          try {
            await NotificationService.createSystemNotification(
              userId,
              messageText
            );
          } catch (notifError) {
            console.error("Error sending notification:", notifError);
          }
        }
      }

      messageApi.success("Cập nhật trạng thái thành công");
      fetchAssignments();
    } catch (error: any) {
      messageApi.error(
        error.response?.data?.message || "Không thể cập nhật trạng thái"
      );
    }
  };

  const handleRevokeAllRoles = async () => {
    try {
      setLoading(true);
      await AssignmentService.revokeAllRoles(userId);

      // Send notification to user
      try {
        await NotificationService.createSystemNotification(
          user._id,
          "Tất cả quyền quản trị của bạn đã bị thu hồi. Nếu bạn cho rằng đây là một sai lầm, vui lòng liên hệ với quản trị viên."
        );
      } catch (notifError) {
        console.error("Error sending notification:", notifError);
      }

      messageApi.success(
        `Đã thu hồi toàn bộ quyền quản trị của ${user.first_name} ${user.last_name}`
      );
      fetchAssignments();
    } catch (error: any) {
      console.error("Error revoking all roles:", error);
      messageApi.error(
        error.response?.data?.message || "Không thể thu hồi quyền"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = () => {
    setAssignModalVisible(true);
  };

  const columns: ColumnsType<Assignment> = [
    {
      title: "Tên quyền",
      dataIndex: ["role", "name"],
      key: "role.name",
      render: (_: string, record: Assignment) => (
        <span className="font-medium text-xs whitespace-nowrap">
          {record.role.name}
        </span>
      ),
    },
    {
      title: "Mã quyền",
      dataIndex: ["role", "code"],
      key: "role.code",
      render: (_: string, record: Assignment) => (
        <Tag color="blue" className="text-xs whitespace-nowrap">
          {record.role.code}
        </Tag>
      ),
    },
    {
      title: "Tình trạng",
      dataIndex: "is_active",
      key: "is_active",
      width: 120,
      align: "center",
      render: (is_active: boolean) => (
        <span
          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: is_active ? "#d4edda" : "#f8d7da",
            color: is_active ? "#155724" : "#721c24",
          }}
        >
          {is_active ? "Đang hoạt động" : "Đã vô hiệu"}
        </span>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: ["role", "description"],
      key: "role.description",
      render: (_: string, record: Assignment) => (
        <span className="text-gray-500 text-xs whitespace-nowrap">
          {record.role.description || "Không có mô tả"}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      fixed: "right",
      align: "center",
      render: (_: unknown, record: Assignment) => (
        <Space>
          <Button
            icon={<Edit size={12} />}
            size="small"
            onClick={() => handleEditAssignment(record)}
            className="text-blue-500"
          />
          <Popconfirm
            title={`Bạn có chắc muốn ${
              record.is_active ? "vô hiệu" : "kích hoạt"
            } quyền này?`}
            onConfirm={() => handleToggleStatus(record._id, record.is_active)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button
              icon={
                record.is_active ? <Lock size={12} /> : <Unlock size={12} />
              }
              type={record.is_active ? "default" : "primary"}
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div className="bg-white">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <h3 className="text-base sm:text-sm font-bold text-[var(--primary-text-color)]">
            Quản lý quyền
          </h3>
          <Space>
            <Popconfirm
              title="Thu hồi toàn bộ quyền quản trị"
              description={`Bạn có chắc chắn muốn thu hồi toàn bộ quyền quản trị của ${user.first_name} ${user.last_name}? Người dùng sẽ nhận được thông báo về hành động này.`}
              onConfirm={handleRevokeAllRoles}
              okText="Xác nhận"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button
                danger
                icon={<UserX size={14} />}
                loading={loading}
                size="small"
              >
                Tước quyền admin
              </Button>
            </Popconfirm>
            <Button
              type="primary"
              icon={<Plus size={14} />}
              onClick={handleAddRole}
              className="flex items-center text-xs sm:text-sm"
              size="small"
            >
              Thêm vai trò
            </Button>
          </Space>
        </div>

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <Table
            columns={columns}
            dataSource={userAssignments}
            rowKey="_id"
            pagination={false}
            size="small"
            loading={rolesLoading}
          />
        </div>

        <AssignRoleModal
          visible={assignModalVisible}
          onCancel={() => setAssignModalVisible(false)}
          onSuccess={() => {
            setAssignModalVisible(false);
            fetchAssignments();
          }}
          selectedAccount={{
            _id: userId,
            user: {
              _id: user._id,
              fullname: `${user.first_name} ${user.last_name}`,
              avatar: user.avatar || "",
            },
          }}
        />

        <EditAssignmentModel
          visible={editModalVisible}
          onCancel={() => {
            setEditModalVisible(false);
            setSelectedAssignment(null);
          }}
          onSuccess={() => {
            setEditModalVisible(false);
            setSelectedAssignment(null);
            fetchAssignments();
          }}
          assignment={selectedAssignment}
        />
      </div>
    </>
  );
};

export default UserRoleManager;
