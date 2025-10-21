import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import SharedItem from "../documentCard/SharedItem";
import {
  UserContext,
  type SharedDocumentItem,
} from "../../../../contexts/UserContext";
import { calculateDocumentRating } from "../../../../utils/CalcRate";

const SharedList: React.FC = () => {
  const { sharedDocuments } = useContext(UserContext);
  const navigate = useNavigate();

  // Lọc và lấy 5 tài liệu đầu tiên (bỏ qua documents bị null hoặc deleted)
  const displayItems: SharedDocumentItem[] = sharedDocuments.filter(
    (item: SharedDocumentItem) => item.document && !item.document.is_deleted
  );
  return (
    <div className="border-l pl-2 md:pl-4">
      {displayItems.map((item: SharedDocumentItem) => {
        const doc = item.document!;
        const rating = calculateDocumentRating(doc.like || 0, doc.dislike || 0);

        // Get user name from document user field
        const userName = doc.user
          ? `${doc.user.first_name} ${doc.user.last_name}`.trim()
          : "Unknown User";

        // Get subject name
        const subjectName = doc.subject?.name || "N/A";

        // Get file type
        const fileType = doc.file_type || "Unknown";

        return (
          <div
            key={item._id}
            onClick={() => navigate(`/document-detail/${doc._id}`)}
            style={{ cursor: "pointer" }}
          >
            <SharedItem
              title={doc.title || "Untitled"}
              rating={rating.ratingPercentage}
              pages={doc.page || 0}
              date={
                item.shared_at
                  ? new Date(item.shared_at).toLocaleDateString("vi-VN")
                  : "N/A"
              }
              intensive={doc.intensive}
              userName={userName}
              subject={subjectName}
              fileType={fileType}
            />
          </div>
        );
      })}
    </div>
  );
};

export default SharedList;
