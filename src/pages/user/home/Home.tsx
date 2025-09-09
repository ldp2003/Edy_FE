import DocumentGrid from "../../../components/user/document/DocumentGrid";

const featuredDocuments = [
  {
    id: "1",
    title: "Tài liệu tổng hợp Kinh tế chính trị Mác-Lênin",
    description: "Kinh tế chính trị Mác-Lênin",
  },
  {
    id: "2",
    title: "Tài liệu tổng hợp Kinh tế chính trị Mác-Lênin",
    description: "Kinh tế chính trị Mác-Lênin",
  },
  {
    id: "3",
    title: "Tài liệu tổng hợp Kinh tế chính trị Mác-Lênin",
    description: "Kinh tế chính trị Mác-Lênin",
  },
  {
    id: "4",
    title: "Tài liệu tổng hợp Kinh tế chính trị Mác-Lênin",
    description: "Kinh tế chính trị Mác-Lênin",
  },
  {
    id: "5",
    title: "Tài liệu tổng hợp Kinh tế chính trị Mác-Lênin",
    description: "Kinh tế chính trị Mác-Lênin",
  },
];

const recentDocuments = [
  {
    id: "6",
    title: "Tài liệu tổng hợp Kinh tế chính trị Mác-Lênin",
    description: "Kinh tế chính trị Mác-Lênin",
  },
  {
    id: "7",
    title: "Tài liệu tổng hợp Kinh tế chính trị Mác-Lênin",
    description: "Kinh tế chính trị Mác-Lênin",
  },
  {
    id: "8",
    title: "Tài liệu tổng hợp Kinh tế chính trị Mác-Lênin",
    description: "Kinh tế chính trị Mác-Lênin",
  },
  {
    id: "9",
    title: "Tài liệu tổng hợp Kinh tế chính trị Mác-Lênin",
    description: "Kinh tế chính trị Mác-Lênin",
  },
  {
    id: "10",
    title: "Tài liệu tổng hợp Kinh tế chính trị Mác-Lênin",
    description: "Kinh tế chính trị Mác-Lênin",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="flex">
        <main className="flex-1 p-6 max-w-full">
          <DocumentGrid
            title="Tài liệu nổi bật"
            documents={featuredDocuments}
          />
          <DocumentGrid title="Xem gần đây" documents={recentDocuments} />
        </main>
      </div>
    </div>
  );
}
