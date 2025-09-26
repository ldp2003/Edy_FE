import React from "react";
import { Modal, Button } from "antd";
import type { Document } from "../../../../models/document";

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
  const getDocumentViewerUrl = () => {
    if (!document?.url) return null;

    // For PDF files, we can use Cloudinary's built-in PDF viewer or embed directly
    if (document.file_type === "PDF") {
      return document.url;
    }

    // For Word documents, convert to viewable format
    if (document.file_type === "WORD") {
      // Use Google Docs Viewer
      return `https://docs.google.com/viewer?url=${encodeURIComponent(
        document.url
      )}&embedded=true`;
    }

    return document.url;
  };

  return (
    <Modal
      title={`Xem tài liệu: ${document.title}`}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width="90vw"
      style={{ maxWidth: "1200px" }}
      bodyStyle={{ padding: 0, height: "80vh" }}
      destroyOnClose={true}
    >
      <div className="w-full h-full">
        {document.file_type === "PDF" ? (
          // For PDF files - direct embed
          <iframe
            src={`${getDocumentViewerUrl()}#toolbar=0&navpanes=1&scrollbar=1`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            title="Document Viewer"
          />
        ) : document.file_type === "WORD" ? (
          // For Word files - use Google Docs Viewer
          <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(
              document.url
            )}&embedded=true`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            title="Document Viewer"
          />
        ) : (
          // For other file types
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Không thể xem trước file này</p>
              <Button
                type="primary"
                onClick={() => window.open(document.url, "_blank")}
              >
                Mở file trong tab mới
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DocumentViewModal;
