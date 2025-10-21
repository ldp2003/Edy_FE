import DocumentCard from "../documentCard/DocumentCard";
import type { Document } from "../../../../models/document";

interface DocumentGridProps {
  title: string;
  documents: (Document | undefined | null)[]; // Allow undefined or null in the array
}

const DocumentGrid: React.FC<DocumentGridProps> = ({ title, documents }) => {
  return (
    <section className="mb-4 bg-white p-2 md:p-4 rounded-lg border border-[var(--border-color)] w-full sm:w-fit">
      <div className="flex justify-between items-center mb-4 sm:mb-2">
        <h2 className="text-sm md:text-base font-bold text-[var(--primary-text-color)]">
          {title}
        </h2>
        <a
          href="#"
          className="text-xs md:text-sm text-[var(--link-color)] hover:underline"
        >
          Xem tất cả {">>"}
        </a>
      </div>
      <div className="flex flex-nowrap md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none">
        {documents
          .filter((doc): doc is Document => doc !== null && doc !== undefined)
          .slice(0, 5)
          .map((doc) => (
            <div key={doc._id} className="min-w-[160px] md:w-auto flex-shrink-0 snap-start">
              <DocumentCard document={doc} />
            </div>
          ))}
      </div>
      <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default DocumentGrid;
