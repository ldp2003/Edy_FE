
import DownloadButton from "../../../common/buttons/DownloadButton";
import ReportButton from "../../../common/buttons/ReportButton";
import LikeButton from "../../../common/buttons/LikeButton";
import DislikeButton from "../../../common/buttons/DislikeButton";
import FavoriteButton from "../../../common/buttons/FavoriteButton";
import ShareButton from "../../../common/buttons/ShareButton";
const DocumentActions: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-4">
      <DownloadButton point={6} />

      <div className="flex items-center space-x-4">
        <ReportButton></ReportButton>
        <LikeButton likeCount={0}></LikeButton>
        <DislikeButton dislikeCount={0}></DislikeButton>
        <FavoriteButton></FavoriteButton>
        <ShareButton></ShareButton>
      </div>
    </div>
  );
};
export default DocumentActions;
