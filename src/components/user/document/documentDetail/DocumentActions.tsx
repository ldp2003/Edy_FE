import DownloadButton from "../../../common/buttons/DownloadButton";
import ReportButton from "../../../common/buttons/ReportButton";
import LikeButton from "../../../common/buttons/LikeButton";
import DislikeButton from "../../../common/buttons/DislikeButton";
import FavoriteButton from "../../../common/buttons/FavoriteButton";
import ShareButton from "../../../common/buttons/ShareButton";
import type { Document } from "../../../../models/document";

interface DocumentActionsProps {
  document: Document;
}

const DocumentActions: React.FC<DocumentActionsProps> = ({ document }) => {
  console.log("Document for actions:", document._id);

  return (
    <div className="flex items-center justify-between p-2">
      <DownloadButton point={6} />

      <div className="flex items-center space-x-4">
        <ReportButton />
        <LikeButton likeCount={0} />
        <DislikeButton dislikeCount={0} />
        <FavoriteButton />
        <ShareButton />
      </div>
    </div>
  );
};
export default DocumentActions;
