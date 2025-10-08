import React from "react";
import SuggestCard from "../documentCard/SuggestCard";
import { DocumentService } from "../../../../utils/DocumentService";

interface RelatedDocumentProps {
  doc_id: string;
}
const RelatedDocument: React.FC<RelatedDocumentProps> = ({ doc_id }) => {
  const [similarDocuments, setSimilarDocuments] = React.useState([]);

  const fetchSimilarDocuments = async () => {
    const respone = await DocumentService.getSimilarDocuments(doc_id);
    setSimilarDocuments(respone.documents);
    console.log(respone);
  };
  React.useEffect(() => {
    fetchSimilarDocuments();
  }, []);
  return (
    <div className="pt-6">
      <h4 className="font-bold text-sm text-[var(--secondary-text-color)] mb-3">
        Gợi ý cho bạn:
      </h4>
      <div className="space-y-3">
        {similarDocuments.map((doc) => (
          <SuggestCard document={doc} />
        ))}
      </div>
    </div>
  );
};

export default RelatedDocument;
