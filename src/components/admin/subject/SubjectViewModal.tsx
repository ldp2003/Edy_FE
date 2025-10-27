import React from "react";
import { Modal, Button } from "antd";
import type { Subject } from "../../../models/subject";

interface SubjectViewModalProps {
  visible: boolean;
  subject: Subject | null;
  onCancel: () => void;
}

const SubjectViewModal: React.FC<SubjectViewModalProps> = ({
  visible,
  subject,
  onCancel,
}) => {
  return (
    <Modal
      title="Chi tiết môn học"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Đóng
        </Button>,
      ]}
      width={600}
    >
      {subject && (
        <div className="space-y-4">
          <div>
            <label className="font-medium">Tên môn học:</label>
            <p>{subject.name}</p>
          </div>
          <div>
            <label className="font-medium">Mã môn học:</label>
            <p>{subject.code}</p>
          </div>
          <div>
            <label className="font-medium">Mô tả:</label>
            <p>{subject.description || "Không có"}</p>
          </div>
          <div>
            <label className="font-medium">Số tài liệu:</label>
            <p>{subject.doc_count}</p>
          </div>
          <div>
            <label className="font-medium">Trạng thái:</label>
            <p
              className={
                subject.is_checked ? "text-green-600" : "text-orange-600"
              }
            >
              {subject.is_checked ? "Đã duyệt" : "Chưa duyệt"}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default SubjectViewModal;
