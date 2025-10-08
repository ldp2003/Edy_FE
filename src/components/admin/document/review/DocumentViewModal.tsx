import React from "react";
import { Modal, Button } from "antd";
import type { Document } from "../../../../models/document";
import SecurePdfViewer from "../compare/SecurePdfViewer";

interface DocumentViewModalProps {
  document: Document;
  visible: boolean;
  onClose: () => void;
}

const DocumentViewModal: React.FC<DocumentViewModalProps> = ({
  document,
  visible,
  onClose,
}) => {
  const renderDocumentContent = () => {
    if (!document?.url) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Không có URL tài liệu</p>
          </div>
        </div>
      );
    }

    switch (document.file_type) {
      case "PDF":
        return <SecurePdfViewer url={document.url} />;

      case "WORD":
        return (
          <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(
              document.url
            )}&embedded=true`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            title="Document Viewer"
          />
        );

      default:
        return (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Không thể xem trước file loại {document.file_type}
              </p>
              <Button
                type="primary"
                onClick={() => window.open(document.url, "_blank")}
              >
                Mở file trong tab mới
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Modal
      title={
        <div className="flex flex-col">
          <span className="text-lg font-medium">{document.title}</span>
          <span className="text-sm text-gray-500 font-normal">
            {document.file_type} • {document.doc_type}
          </span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      style={{ maxWidth: "1200px" }}
      bodyStyle={{ padding: 0, height: "80vh" }}
      destroyOnClose={true}
      className="document-view-modal"
      centered={true}
    >
      <div className="w-full h-full overflow-hidden">
        {renderDocumentContent()}
      </div>
    </Modal>
  );
};

export default DocumentViewModal;
