import DocumentCard from "../documentCard/DocumentCard";
import type { Document } from "../../../../models/document";

interface DocumentGridProps {
  title: string;
  documents: Document[];
}

const DocumentGrid: React.FC<DocumentGridProps> = ({ title, documents }) => {
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2
          className="text-xl font-bold text-gray-800"
          style={{ color: "var(--primary-text-color)" }}
        >
          {title}
        </h2>
        <a href="#" className="text-sm text-blue-500 hover:underline">
          Xem tất cả {">>"}
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {documents.map((doc) => (
          <DocumentCard
            key={doc._id}
            title={doc.title}
            description={doc.description?.summary_by_user || doc.subject.name}
            imageUrl={doc.cover_page}
            document={doc}
          />
        ))}
      </div>
    </section>
  );
};

export default DocumentGrid;
