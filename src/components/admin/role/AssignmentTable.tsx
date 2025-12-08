/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Button,
  message,
  Popconfirm,
  Avatar,
  Card,
  Space,
  // Modal,
  // Form,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { Edit, Lock, Unlock, Plus, UserX } from "lucide-react";
import { AssignmentService } from "../../../utils/AssignmentService";
import { ROLE_DISPLAY_NAMES } from "../../../constants/RoleConstants";
import { getStatusStyle } from "../../../utils/AdminTableStyles";
import AssignRoleModal from "./AssignRoleModal";
import EditAssignmentModel from "./EditAssigmentModel";
import { Input } from "antd";
import { NotificationService } from "../../../utils/NotificationService";
import type { User } from "../../../models/user";
import { UserContext } from "../../../contexts/UserContext";
const { Search } = Input;

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

const AssignmentTable: React.FC<{ selectedUser?: User }> = ({
  selectedUser,
}) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  // const [isModalVisible, setIsModalVisible] = useState(false);
  // const [form] = Form.useForm();
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [searchText, setSearchText] = useState("");
  const { user } = useContext(UserContext);
  const currentUserId = user?._id;

  const filteredAssignments = assignments.filter((assignment: Assignment) => {
    if (selectedUser) {
      return assignment.account._id === selectedUser._id;
    }
    const searchLower = searchText.toLowerCase();
    return (
      assignment.account.user.fullname.toLowerCase().includes(searchLower) ||
      assignment.account._id.toLowerCase().includes(searchLower) ||
      assignment.organization?.name?.toLowerCase().includes(searchLower) ||
      assignment.organization?._id?.toLowerCase().includes(searchLower)
    );
  });
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await AssignmentService.getAllAssignments();
      // Lấy assignments từ response.data
      const assignmentData = response || [];
      console.log("Assignment data:", assignmentData);
      setAssignments(assignmentData);
    } catch {
      message.error("Không thể tải danh sách phân quyền");
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

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
      const assignment = assignments.find((a) => a._id === assignmentId);
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
            // Don't fail the whole operation if notification fails
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

  const handleRevokeAllRoles = async (
    accountId: string,
    userId: string,
    userName: string
  ) => {
    console.log("assignment.account:", { accountId, userId, userName });
    try {
      setLoading(true);
      await AssignmentService.revokeAllRoles(accountId);

      // Send notification to user
      if (userId) {
        try {
          await NotificationService.createSystemNotification(
            userId,
            "Tất cả quyền quản trị của bạn đã bị thu hồi. Nếu bạn cho rằng đây là một sai lầm, vui lòng liên hệ với quản trị viên."
          );
        } catch (notifError) {
          console.error("Error sending notification:", notifError);
          // Don't fail the whole operation if notification fails
        }
      }

      messageApi.success(`Đã thu hồi toàn bộ quyền quản trị của ${userName}`);
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

  // const handleEdit = async (assignmentId: string, values: any) => {
  //     try {
  //         await AssignmentService.updateAssignment(assignmentId, {
  //             role: values.role,
  //             subject: values.subject,
  //             organization: values.organization,
  //         });
  //         messageApi.success("Cập nhật phân quyền thành công");
  //         fetchAssignments();
  //         Modal.destroyAll(); // Đóng modal sau khi cập nhật thành công
  //     } catch (error: any) {
  //         console.error('Error updating assignment:', error);
  //         messageApi.error(error.response?.data?.message || "Không thể cập nhật phân quyền");
  //     }
  // };

  // const handleCreate = async (values: any) => {
  //     try {
  //         //   await AssignmentService.createAssignment(values);
  //         message.success("Tạo phân quyền thành công");
  //         setIsModalVisible(false);
  //         form.resetFields();
  //         fetchAssignments();
  //     } catch (error) {
  //         message.error("Không thể tạo phân quyền");
  //     }
  // };

  const columns: ColumnsType<any> = [
    // {
    //     title: "Người dùng",
    //     key: "user",
    //     render: (_, record) => (
    //         <Space>
    //             <Avatar src={record.account.user.avatar} />
    //             <span>{record.account.user.fullname}</span>
    //         </Space>
    //     ),
    // },
    {
      title: "Vai trò",
      key: "role",
      ellipsis: true,
      render: (_, record) => {
        return ROLE_DISPLAY_NAMES[record.role.name] || record.role.name;
      },
    },
    // {
    //     title: "Môn học",
    //     key: "subject",
    //     render: (_, record) => {
    //         const assignment = record.assignments[0];
    //         return assignment.subject?.name || "-";
    //     }
    // },
    // {
    //   title: "Tổ chức",
    //   key: "organization",
    //   ellipsis: true,
    //   render: (_, record) => {
    //     return record.organization?.name || "-";
    //   },
    // },
    {
      title: "Trạng thái",
      key: "status",
      width: 120,
      align: "center",
      render: (_, record) => {
        return (
          <span
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
            style={getStatusStyle(record.is_active ? "active" : "banned")}
          >
            {record.is_active ? "Đang hoạt động" : "Đã vô hiệu"}
          </span>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            icon={<Edit size={16} />}
            onClick={() => {
              setSelectedAssignment(record);
              setIsEditModalVisible(true);
            }}
          />
          <Popconfirm
            title={`Bạn có chắc muốn ${
              record.is_active ? "vô hiệu" : "kích hoạt"
            } phân quyền này?`}
            onConfirm={() => handleToggleStatus(record._id, record.is_active)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button
              icon={
                record.is_active ? <Lock size={16} /> : <Unlock size={16} />
              }
              type={record.is_active ? "default" : "primary"}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // const groupedAssignments = (assignments || []).reduce((acc: any[], assignment) => {
  //     const accountId = assignment.account._id;
  //     const existingAccount = acc.find(item => item.account._id === accountId);

  //     if (existingAccount) {
  //         existingAccount.assignments.push(assignment);
  //     } else {
  //         acc.push({
  //             account: assignment.account,
  //             assignments: [assignment],
  //         });
  //     }

  //     return acc;
  // }, []);

  return (
    <>
      {contextHolder}
      <div className="space-y-4">
        <div className="flex justify-between items-center gap-4">
          <h1 className="text-base text-[var(--primary-text-color)] font-bold">
            Quản lý phân quyền
          </h1>
          <div className="flex items-center gap-4 flex-1 justify-end">
            <Search
              placeholder="Tìm kiếm theo tên, ID người dùng hoặc tổ chức"
              allowClear
              className="max-w-md"
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
            />
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={() => {
                setSelectedAccount(null);
                setIsAssignModalVisible(true);
              }}
            >
              Gán quyền cho người dùng
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredAssignments.map((assignment: any) => {
            console.log("assignment.account:", assignment.account);
            const isSelf =
              assignment?.account?.user?._id === currentUserId ||
              assignment?.account?.user?.id === currentUserId;

            return (
              <Card key={assignment.account._id} className="text-left w-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar size={50} src={assignment.account.user.avatar} />
                    <div>
                      <h2 className="text-sm font-bold text-[var(--primary-text-color)] ">
                        {assignment.account.user.fullname}
                      </h2>
                      <span className="text-gray-500">
                        ID: {assignment.account._id}
                      </span>
                    </div>
                  </div>
                  <Space>
                    {!isSelf && (
                      <Popconfirm
                        title="Thu hồi toàn bộ quyền quản trị"
                        description={`Bạn có chắc chắn muốn thu hồi toàn bộ quyền quản trị của ${assignment.account.user.fullname}? Người dùng sẽ nhận được thông báo về hành động này.`}
                        onConfirm={() =>
                          handleRevokeAllRoles(
                            assignment.account._id,
                            assignment.account.user.id,
                            assignment.account.user.fullname
                          )
                        }
                        okText="Xác nhận"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                      >
                        <Button
                          danger
                          icon={<UserX size={16} />}
                          loading={loading}
                        >
                          Tước quyền admin
                        </Button>
                      </Popconfirm>
                    )}
                    <Button
                      type="primary"
                      icon={<Plus size={16} />}
                      onClick={() => {
                        setSelectedAccount(assignment.account);
                        setIsAssignModalVisible(true);
                      }}
                    >
                      Thêm vai trò
                    </Button>
                  </Space>
                </div>
                <Table
                  columns={columns}
                  dataSource={assignment.assignments}
                  rowKey={(record) => record._id}
                  loading={loading}
                  pagination={false}
                />
              </Card>
            );
          })}
        </div>

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
          onCancel={() => {
            setIsAssignModalVisible(false);
            setSelectedAccount(null);
          }}
          onSuccess={() => {
            setIsAssignModalVisible(false);
            setSelectedAccount(null);
            fetchAssignments();
          }}
          selectedAccount={selectedAccount}
        />
      </div>
    </>
  );
};

export default AssignmentTable;