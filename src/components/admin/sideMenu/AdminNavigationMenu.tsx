import {
  Home,
  BarChart3,
  FileText,
  Users,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Shield,
  Settings,
  Building,
  PieChart,
  Flag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { PERMISSIONS } from "../../../constants/PermissionConstants";

interface AdminNavigationMenuProps {
  isCompact?: boolean;
}

interface MenuItem {
  icon: LucideIcon;
  label: string;
  path?: string;
  children?: {
    icon: LucideIcon;
    label: string;
    path: string;
    permission?: string;
  }[];
  permission?: string;
}

export function AdminNavigationMenu({ isCompact }: AdminNavigationMenuProps) {
  const location = useLocation();
  const { permissions } = useContext(UserContext);

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Auto-expand items when location changes
  useEffect(() => {
    const expanded: string[] = [];
    menuItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          (child) => location.pathname === child.path
        );
        if (hasActiveChild) {
          expanded.push(item.label);
        }
      }
    });
    setExpandedItems(expanded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const hasPermission = (permission: string) => {
    return (
      permissions?.includes(permission) ||
      permissions?.includes(PERMISSIONS.ALL)
    );
  };

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
      icon: FileText,
      label: "Quản lý nội dung",
      permission: PERMISSIONS.MANAGE_DOCUMENT,
      children: [
        {
          icon: FileText,
          label: "Tài liệu",
          path: "/admin/documents/all",
          permission: PERMISSIONS.MANAGE_DOCUMENT,
        },
        {
          icon: BookOpen,
          label: "Môn học",
          path: "/admin/subjects",
          permission: PERMISSIONS.MANAGE_ENTITY,
        },
      ],
    },
    {
      icon: Users,
      label: "Quản lý người dùng",
      permission: PERMISSIONS.MANAGE_USER,
      children: [
        {
          icon: Users,
          label: "Tất cả người dùng",
          path: "/admin/users",
          permission: PERMISSIONS.MANAGE_USER,
        },
        {
          icon: Shield,
          label: "Phân quyền",
          path: "/admin/users/assign-roles",
          permission: PERMISSIONS.MANAGE_ROLE,
        },
        {
          icon: Settings,
          label: "Quản lý quyền",
          path: "/admin/users/manage-roles",
          permission: PERMISSIONS.MANAGE_ROLE,
        },
        {
          icon: Building,
          label: "Tổ chức",
          path: "/admin/organizations",
          permission: PERMISSIONS.MANAGE_ENTITY,
        },
      ],
    },
    {
      icon: BarChart3,
      label: "Giám sát",
      children: [
        {
          icon: BarChart3,
          label: "Thống kê tài liệu",
          path: "/admin/statistics/documents",
          permission: PERMISSIONS.MANAGE_DOCUMENT,
        },
        {
          icon: PieChart,
          label: "Thống kê người dùng",
          path: "/admin/statistics/users",
          permission: PERMISSIONS.MANAGE_USER,
        },
        {
          icon: Flag,
          label: "Báo cáo",
          path: "/admin/reports",
          permission: PERMISSIONS.HANDLE_DOCUMENT_REPORT,
        },
      ],
    },
  ];

  const filteredMenuItems = menuItems
    .filter((item) => !item.permission || hasPermission(item.permission))
    .map((item) => ({
      ...item,
      children: item.children?.filter(
        (child) => !child.permission || hasPermission(child.permission)
      ),
    }))
    .filter((item) => !item.children || item.children.length > 0);

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
        {filteredMenuItems.map((item, index) => (
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
                          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm cursor-pointer ${
                            isChildActive(child.path)
                              ? "bg-blue-50 text-[var(--primary-color)]"
                              : "text-[var(--secondary-text-color)] hover:bg-gray-50"
                          }`}
                        >
                          <child.icon className="w-4 h-4" />
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
