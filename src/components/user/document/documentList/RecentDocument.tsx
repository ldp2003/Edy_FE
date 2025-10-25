import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import RecentItem from "../documentCard/RecentItem";
import { UserContext } from "../../../../contexts/UserContext";
import type { Document } from "../../../../models/document";
import { calculateDocumentRating } from "../../../../utils/CalcRate";

const RecentDocument: React.FC = () => {
  const { personalDocuments } = useContext(UserContext);
  const navigate = useNavigate();

  // Lọc tài liệu theo trạng thái "APPROVED" và lấy 5 bài đầu tiên
  const approvedDocs: Document[] = personalDocuments
    .filter((doc) => doc.status === "APPROVED")
    .slice(0, 5);

  return (
    <div className="border-l pl-4">
      {approvedDocs.map((doc: Document) => {
        const rating = calculateDocumentRating(doc.like || 0, doc.dislike || 0);

        return (
          <div
            key={doc._id}
            onClick={() =>
              navigate(`/personal-posts/document-detail/${doc._id}`)
            }
            style={{ cursor: "pointer" }}
          >
            <RecentItem
              title={doc.title}
              views={doc.view || 0}
              rating={rating.ratingPercentage}
              pages={doc.page || 0}
              date={new Date(doc.createdAt).toLocaleDateString("vi-VN")}
            />
          </div>
        );
      })}
    </div>
  );
};

export default RecentDocument;
