import DocumentCard from "../documentCard/DocumentCard";
import type { Document } from "../../../../models/document";

interface DocumentGridProps {
  title: string;
  documents: (Document | undefined | null)[]; // Allow undefined or null in the array
  onViewMore?: () => void;
}

const DocumentGrid: React.FC<DocumentGridProps> = ({
  title,
  documents,
  onViewMore,
}) => {
  return (
    <section className="mb-4 bg-white p-4 rounded-lg border border-[var(--border-color)]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm md:text-base font-bold text-[var(--primary-text-color)] text-center md:text-left">
          {title}
        </h2>
        {onViewMore && (
          <button
            onClick={onViewMore}
            className="text-xs md:text-sm text-[var(--link-color)] hover:underline cursor-pointer"
          >
            Xem tất cả {">>"}
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
        {documents
          .filter((doc): doc is Document => doc !== null && doc !== undefined)
          .slice(0, 5)
          .map((doc) => (
            <DocumentCard key={doc._id} document={doc} />
          ))}
      </div>
    </section>
  );
};

export default DocumentGrid;
