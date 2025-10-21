// import { useNavigate } from "react-router-dom";
import type { Subject } from "../../../models/subject";
import SubjectItem from "./SubjectItem";

interface SubjectGridProps {
  title: string;
  subjects?: Subject[];
  onSubjectClick?: (subject: Subject) => void;
}

const SubjectGrid: React.FC<SubjectGridProps> = ({
  title,
  subjects,
  onSubjectClick,
}) => {
  return (
    <section className="mb-4 bg-white p-4 rounded-lg border border-[var(--border-color)]">
      <div className="flex justify-between items-center mb-4">
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
        {(subjects || []).slice(0, 5).map((subject) => (
          <SubjectItem
            key={subject._id}
            subject={subject}
            onClick={onSubjectClick}
          />
        ))}
      </div>
    </section>
  );
};

export default SubjectGrid;
