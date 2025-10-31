import React from "react";
import SuggestCard from "../documentCard/SuggestCard";
import { DocumentService } from "../../../../utils/DocumentService";
import type { Document } from "../../../../models/document";

interface RelatedDocumentProps {
  doc_id: string;
}
const RelatedDocument: React.FC<RelatedDocumentProps> = ({ doc_id }) => {
  const [similarDocuments, setSimilarDocuments] = React.useState<Document[]>(
    []
  );

  const fetchSimilarDocuments = async () => {
    const respone = await DocumentService.getSimilarDocuments(doc_id);
    setSimilarDocuments(respone.documents);
  };
  React.useEffect(() => {
    fetchSimilarDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc_id]);
  return (
    <div className="pt-6 border-t border-gray-200">
      <h4 className="font-bold text-sm text-[var(--secondary-text-color)] mb-4">
        Gợi ý cho bạn:
      </h4>
      <div className="space-y-3">
        {similarDocuments.map((doc) => (
          <SuggestCard key={doc._id} document={doc} />
        ))}
      </div>
    </div>
  );
};

export default RelatedDocument;
