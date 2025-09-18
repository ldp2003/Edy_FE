import {
  Home,
  BarChart3,
  FileText,
  Users,
  Flag,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

interface AdminNavigationMenuProps {
  isCompact?: boolean;
}

interface MenuItem {
  icon: LucideIcon;
  label: string;
  path?: string;
  children?: { label: string; path: string }[];
}

export function AdminNavigationMenu({ isCompact }: AdminNavigationMenuProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const menuItems: MenuItem[] = [
    { icon: Home, label: "Trang chủ", path: "/admin" },
    {
      icon: BarChart3,
      label: "Thống kê",
      children: [
        { label: "Thống kê tài liệu", path: "/admin/statistics/documents" },
        { label: "Thống kê người dùng", path: "/admin/statistics/users" },
        { label: "Thống kê chung", path: "/admin/statistics/general" },
      ],
    },
    {
      icon: FileText,
      label: "Tài liệu",
      children: [
        { label: "Tất cả tài liệu", path: "/admin/documents/all" },
        { label: "Tài liệu đang chờ duyệt", path: "/admin/documents/pending" },
      ],
    },
    {
      icon: Users,
      label: "Người dùng",
      children: [
        { label: "Tất cả người dùng", path: "/admin/users/all" },
        { label: "Phân quyền", path: "/admin/users/assign-roles" },
        { label: "Quản lý quyền", path: "/admin/users/manage-roles" },
      ],
    },
    {
      icon: Flag,
      label: "Báo cáo",
      children: [
        { label: "Quản lý danh sách các báo cáo", path: "/admin/reports" },
      ],
    },
  ];

  const isItemActive = (item: MenuItem): boolean => {
    if (item.path) {
      return location.pathname === item.path;
    }
    if (item.children) {
      return item.children.some((child) => location.pathname === child.path);
    }
    return false;
  };

  const isChildActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <nav className="p-4">
      <ul
        className={`text-left space-y-2 ${
          isCompact ? "flex flex-col items-center space-y-4" : ""
        }`}
      >
        {menuItems.map((item, index) => (
          <li key={index}>
            {item.children ? (
              // Menu item with children (dropdown)
              <div>
                <button
                  onClick={() => !isCompact && toggleExpanded(item.label)}
                  className={`w-full flex items-center justify-${
                    isCompact ? "center" : "between"
                  } gap-3 px-3 py-2 rounded-md transition-colors text-sm cursor-pointer ${
                    isItemActive(item)
                      ? "bg-blue-100 text-[var(--primary-color)]"
                      : "text-[var(--secondary-text-color)] hover:bg-gray-100"
                  }`}
                >
                  <div
                    className={`flex items-center gap-3 ${
                      isCompact ? "justify-center" : ""
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {!isCompact && item.label}
                  </div>
                  {!isCompact &&
                    (expandedItems.includes(item.label) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    ))}
                </button>

                {/* Children items */}
                {!isCompact && expandedItems.includes(item.label) && (
                  <ul className="ml-6 mt-2 space-y-1">
                    {item.children.map((child, childIndex) => (
                      <li key={childIndex}>
                        <Link
                          to={child.path}
                          className={`block px-3 py-2 rounded-md transition-colors text-sm cursor-pointer ${
                            isChildActive(child.path)
                              ? "bg-blue-50 text-[var(--primary-color)]"
                              : "text-[var(--secondary-text-color)] hover:bg-gray-50"
                          }`}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              // Simple menu item without children
              <Link
                to={item.path!}
                className={`flex items-center justify-${
                  isCompact ? "center" : "start"
                } gap-3 px-3 py-2 rounded-md transition-colors text-sm cursor-pointer ${
                  isItemActive(item)
                    ? "bg-blue-100 text-[var(--primary-color)]"
                    : "text-[var(--secondary-text-color)] hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {!isCompact && item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
