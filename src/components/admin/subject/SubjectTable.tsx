import React from "react";
import { Table, Button } from "antd";
import { EditOutlined, DeleteOutlined, SyncOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Subject } from "../../../models/subject";

interface SubjectTableProps {
  subjects: Subject[];
  loading: boolean;
  onEdit: (subject: Subject) => void;
  onDelete: (subjectId: string) => void;
  onView: (subject: Subject) => void;
  onSync?: (subjectId: string) => void;
  syncingSubjects?: Set<string>;
}

const SubjectTable: React.FC<SubjectTableProps> = ({
  subjects,
  loading,
  onEdit,
  onDelete,
  onView,
  onSync,
  syncingSubjects = new Set(),
}) => {
  const columns: ColumnsType<Subject> = [
    {
      title: "STT",
      key: "index",
      className: "text-center text-base sm:text-sm xs:text-xs",
      fixed: "left",
      render: (_, __, index) => (
        <span className="text-base sm:text-sm xs:text-xs font-medium">
          {index + 1}
        </span>
      ),
    },
    {
      title: "Tên môn học",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      className: "text-left text-base sm:text-sm xs:text-xs",
      fixed: "left",
      render: (name: string, record: Subject) => (
        <Button
          type="link"
          onClick={() => onView(record)}
          className="text-left text-base sm:text-sm xs:text-xs p-0 h-auto"
        >
          {name}
        </Button>
      ),
    },
    {
      title: "Mã môn học",
      dataIndex: "code",
      key: "code",
      sorter: (a, b) => a.code.localeCompare(b.code),
      className: "text-left text-base sm:text-sm xs:text-xs",
      responsive: ["md"],
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      className: "text-left text-base sm:text-sm xs:text-xs",
      responsive: ["lg"],
    },
    {
      title: "Số tài liệu",
      dataIndex: "doc_count",
      key: "doc_count",
      sorter: (a, b) => a.doc_count - b.doc_count,
      className: "text-left text-base sm:text-sm xs:text-xs",
      responsive: ["sm"],
    },
    {
      title: "Trạng thái",
      dataIndex: "is_checked",
      key: "is_checked",
      className: "text-left text-base sm:text-sm xs:text-xs",
      responsive: ["md"],
      render: (isChecked: boolean) => (
        <span
          className={`${
            isChecked ? "text-green-600" : "text-orange-600"
          } text-base sm:text-sm xs:text-xs`}
        >
          {isChecked ? "Đã duyệt" : "Chưa duyệt"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      className: "text-left text-base sm:text-sm xs:text-xs",
      fixed: "right",
      render: (_, record) => (
        <div className="flex flex-wrap gap-2">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            className="text-base sm:text-sm xs:text-xs p-0"
          >
            Sửa
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record._id)}
            className="text-base sm:text-sm xs:text-xs p-0"
          >
            Xóa
          </Button>
          {onSync && (
            <Button
              type="link"
              size="small"
              icon={
                syncingSubjects.has(record._id) ? undefined : <SyncOutlined />
              }
              onClick={() => onSync(record._id)}
              className="text-base sm:text-sm xs:text-xs p-0 text-blue-600"
              loading={syncingSubjects.has(record._id)}
              disabled={syncingSubjects.has(record._id)}
            >
              {syncingSubjects.has(record._id) ? "Đang đồng bộ..." : "Đồng bộ"}
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <Table
        columns={columns}
        dataSource={subjects}
        rowKey="_id"
        loading={loading}
        scroll={{ x: "max-content" }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} môn học`,
        }}
        className="min-w-full"
      />
    </div>
  );
};

export default SubjectTable;
