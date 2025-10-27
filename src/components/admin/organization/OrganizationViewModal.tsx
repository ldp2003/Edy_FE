import React from "react";
import { Modal, Button } from "antd";
import type { OrganizationDetailed } from "../../../models/organization";

interface OrganizationViewModalProps {
  visible: boolean;
  organization: OrganizationDetailed | null;
  onCancel: () => void;
}

const OrganizationViewModal: React.FC<OrganizationViewModalProps> = ({
  visible,
  organization,
  onCancel,
}) => {
  return (
    <Modal
      title="Chi tiết tổ chức"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Đóng
        </Button>,
      ]}
      width={600}
    >
      {organization && (
        <div className="space-y-4">
          <div>
            <label className="font-medium">Tên tổ chức:</label>
            <p>{organization.name}</p>
          </div>
          <div>
            <label className="font-medium">Mã tổ chức:</label>
            <p>{organization.code}</p>
          </div>
          <div>
            <label className="font-medium">Mô tả:</label>
            <p>{organization.description || "Không có"}</p>
          </div>
          <div>
            <label className="font-medium">Quốc gia:</label>
            <p>{organization.country}</p>
          </div>
          <div>
            <label className="font-medium">Địa chỉ:</label>
            <p>{organization.address}</p>
          </div>
          <div>
            <label className="font-medium">Website:</label>
            {organization.website ? (
              <a
                href={
                  organization.website.startsWith("http")
                    ? organization.website
                    : `https://${organization.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {organization.website}
              </a>
            ) : (
              <p>Không có</p>
            )}
          </div>
          <div>
            <label className="font-medium">Trạng thái:</label>
            <p
              className={
                organization.is_checked ? "text-green-600" : "text-orange-600"
              }
            >
              {organization.is_checked ? "Đã duyệt" : "Chưa duyệt"}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default OrganizationViewModal;
