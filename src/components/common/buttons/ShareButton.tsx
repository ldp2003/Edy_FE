import React, { useState } from "react";
import { Forward } from "lucide-react";
import ShareModal from "../../user/share/ShareModal";

interface ShareButtonProps {
  documentId: string;
  documentTitle: string;
  isPublic?: boolean;
  isSharedWithOrganization?: boolean;
  isPrivate?: boolean;
  isPrivateShared?: boolean;
  isOwner?: boolean;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  documentId,
  documentTitle,
  isPublic = false,
  isSharedWithOrganization = false,
  isPrivate = false,
  isPrivateShared = false,
  isOwner = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleShareClick = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <>
      <div
        className="text-xs flex items-center space-x-2 rounded-2xl border border-gray-300 px-3 py-1 bg-white font-semibold cursor-pointer text-blue-600 transition-colors duration-300 hover:bg-blue-600 hover:text-white"
        onClick={handleShareClick}
      >
        <Forward size={15} />
        <span className="text-xs">Chia sẻ</span>
      </div>

      <ShareModal
        visible={modalVisible}
        onClose={handleModalClose}
        documentId={documentId}
        documentTitle={documentTitle}
        isPublic={isPublic}
        isSharedWithOrganization={isSharedWithOrganization}
        isPrivate={isPrivate}
        isPrivateShared={isPrivateShared}
        isOwner={isOwner}
      />
    </>
  );
};

export default ShareButton;
