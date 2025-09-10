import DocumentCard from "./DocumentCard";

interface Document {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            title={doc.title}
            description={doc.description}
            imageUrl={doc.imageUrl}
          />
        ))}
      </div>
    </section>
  );
};

export default DocumentGrid;
