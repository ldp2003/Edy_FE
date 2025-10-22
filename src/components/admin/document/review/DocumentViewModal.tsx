import React, { useState, useEffect } from "react";
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
  const [modalHeight, setModalHeight] = useState("80vh");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setModalHeight(mobile ? "85vh" : "80vh");
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  const renderDocumentContent = () => {
    if (!document?.url) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100 p-4">
          <div className="text-center">
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Không có URL tài liệu
            </p>
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
            className="w-full h-full"
          />
        );

      default:
        return (
          <div className="flex items-center justify-center h-full bg-gray-100 p-4">
            <div className="text-center">
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Không thể xem trước file loại {document.file_type}
              </p>
              <Button
                type="primary"
                size={isMobile ? "small" : "middle"}
                onClick={() => window.open(document.url, "_blank")}
                className="text-xs sm:text-sm"
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
          <span className="text-base sm:text-lg font-medium truncate pr-8">
            {document.title}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 font-normal">
            {document.file_type} • {document.doc_type}
          </span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={isMobile ? "95vw" : "90vw"}
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        top: isMobile ? "2vh" : "5vh",
      }}
      styles={{
        body: {
          padding: 0,
          height: modalHeight,
          overflow: "hidden",
        },
      }}
      destroyOnClose={true}
      className="document-view-modal"
      centered={!isMobile}
    >
      <div className="w-full h-full overflow-hidden">
        {renderDocumentContent()}
      </div>
    </Modal>
  );
};

export default DocumentViewModal;
