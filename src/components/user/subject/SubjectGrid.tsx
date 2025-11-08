import { useNavigate } from "react-router-dom";
import type { Subject } from "../../../models/subject";
import SubjectItem from "./SubjectItem";

interface SubjectGridProps {
  title: string;
  subjects?: Subject[];
  onSubjectClick?: (subject: Subject) => void;
  loading?: boolean;
}

const SubjectGrid: React.FC<SubjectGridProps> = ({
  title,
  subjects,
  onSubjectClick,
  loading = false,
}) => {
  const navigate = useNavigate();
  return (
    <section className="mb-4 bg-white p-4 rounded-lg border border-[var(--border-color)]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm md:text-base font-bold text-[var(--primary-text-color)] text-left">
          {title}
        </h2>
        <span
          className="text-xs md:text-sm text-[var(--link-color)] hover:underline cursor-pointer whitespace-nowrap"
          onClick={() => navigate("/organization/68c664e2db47c87d6578986f")}
        >
          Xem tất cả {">>"}
        </span>
      </div>
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4 min-w-max md:min-w-0">
          {loading
            ? // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse flex-shrink-0 w-[280px] md:w-auto"
                >
                  <div className="bg-gray-200 rounded-lg h-24 mb-2"></div>
                  <div className="bg-gray-200 rounded h-4"></div>
                </div>
              ))
            : (subjects || []).slice(0, 5).map((subject) => (
                <div
                  key={subject._id}
                  className="flex-shrink-0 w-[280px] md:w-auto"
                >
                  <SubjectItem subject={subject} onClick={onSubjectClick} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default SubjectGrid;
