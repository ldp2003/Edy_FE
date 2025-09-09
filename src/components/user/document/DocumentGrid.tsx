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
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
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
