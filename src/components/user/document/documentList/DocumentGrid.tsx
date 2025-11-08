import { useState, useEffect } from "react";
import DocumentCard from "../documentCard/DocumentCard";
import type { Document } from "../../../../models/document";

interface DocumentGridProps {
  title: string;
  documents: (Document | undefined | null)[]; // Allow undefined or null in the array
  onViewMore?: () => void;
  loading?: boolean;
}

const DocumentGrid: React.FC<DocumentGridProps> = ({
  title,
  documents,
  onViewMore,
  loading = false,
}) => {
  const [displayCount, setDisplayCount] = useState(6);

  useEffect(() => {
    const updateDisplayCount = () => {
      const width = window.innerWidth;
      if (width >= 1536) {
        // 2xl
        setDisplayCount(6);
      } else if (width >= 1024) {
        // lg
        setDisplayCount(6);
      } else if (width >= 640) {
        // sm
        setDisplayCount(6);
      } else {
        // mobile
        setDisplayCount(6);
      }
    };

    updateDisplayCount();
    window.addEventListener("resize", updateDisplayCount);
    return () => window.removeEventListener("resize", updateDisplayCount);
  }, []);

  return (
    <section className="mb-4 bg-white p-4 rounded-lg border border-[var(--border-color)]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm md:text-base font-bold text-[var(--primary-text-color)] text-left">
          {title}
        </h2>
        {onViewMore && (
          <button
            onClick={onViewMore}
            className="text-xs md:text-sm text-[var(--link-color)] hover:underline cursor-pointer whitespace-nowrap"
          >
            Xem tất cả {">>"}
          </button>
        )}
      </div>
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex md:grid md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-4 min-w-max md:min-w-0">
          {loading
            ? // Loading skeleton
              Array.from({ length: displayCount }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse flex-shrink-0 w-[160px] md:w-auto"
                >
                  <div className="bg-gray-200 rounded-lg h-48 mb-2"></div>
                  <div className="bg-gray-200 rounded h-4 mb-1"></div>
                  <div className="bg-gray-200 rounded h-3 mb-1"></div>
                  <div className="bg-gray-200 rounded h-3"></div>
                </div>
              ))
            : documents
                .filter(
                  (doc): doc is Document => doc !== null && doc !== undefined
                )
                .slice(0, displayCount)
                .map((doc) => (
                  <div
                    key={doc._id}
                    className="flex-shrink-0 w-[160px] md:w-auto"
                  >
                    <DocumentCard document={doc} />
                  </div>
                ))}
        </div>
      </div>
    </section>
  );
};

export default DocumentGrid;
