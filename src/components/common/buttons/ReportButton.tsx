import { Flag } from "lucide-react";
import React, { useState } from "react";
import ReportModal from "../../user/report/ReportModal";

interface ReportButtonProps {
  documentId: string;
  documentTitle: string;
}

const ReportButton: React.FC<ReportButtonProps> = ({
  documentId,
  documentTitle,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleReportClick = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <>
      <div>
        <button
          onClick={handleReportClick}
          className="text-xs flex items-center space-x-2 rounded-2xl border border-gray-300 px-3 py-1 bg-white font-semibold cursor-pointer text-[var(--red-button-color)] transition-colors duration-300 hover:bg-[#d63847] hover:text-white"
        >
          <Flag size={15} />
          <span className="text-xs">Báo cáo</span>
        </button>
      </div>

      <ReportModal
        visible={modalVisible}
        onClose={handleModalClose}
        documentId={documentId}
        documentTitle={documentTitle}
      />
    </>
  );
};

export default ReportButton;
