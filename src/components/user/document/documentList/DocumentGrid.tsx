import DocumentCard from "../documentCard/DocumentCard";
import type { Document } from "../../../../models/document";

interface DocumentGridProps {
  title: string;
  documents: Document[];
}

const DocumentGrid: React.FC<DocumentGridProps> = ({ title, documents }) => {
  return (
    <section className="mb-8 bg-white p-4 rounded-lg  border border-[var(--border-color)]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-bold text-[var(--primary-text-color)]">
          {title}
        </h2>
        <a href="#" className="text-sm text-[var(--link-color)] hover:underline">
          Xem tất cả {">>"}
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {documents.map((doc) => (
          <DocumentCard
            key={doc._id}
            title={doc.title}
            description={doc.subject?.name || "Chưa có môn học"}
            imageUrl={doc.cover_page}
            document={doc}
          />
        ))}
      </div>
    </section>
  );
};

export default DocumentGrid;
