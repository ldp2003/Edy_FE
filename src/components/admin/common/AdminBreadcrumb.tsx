import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface AdminBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function AdminBreadcrumb({ items }: AdminBreadcrumbProps) {
  return (
    <nav className="flex items-center flex-nowrap space-x-1 sm:space-x-2 text-xs sm:text-sm text-[var(--third-text-color)] mb-3 sm:mb-4 overflow-hidden min-w-0">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 font-light text-gray-400 flex-shrink-0" />
          )}
          {item.path && index < items.length - 1 ? (
            <Link
              to={item.path}
              className="hover:text-[var(--link-color)] transition-colors cursor-pointer truncate max-w-[80px] sm:max-w-[120px] lg:max-w-[200px] xl:max-w-none flex-shrink-0"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={`truncate max-w-[100px] sm:max-w-[150px] lg:max-w-[250px] xl:max-w-none flex-shrink-0 ${
                index === items.length - 1
                  ? "text-[var(--third-text-color)] font-medium"
                  : ""
              }`}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
