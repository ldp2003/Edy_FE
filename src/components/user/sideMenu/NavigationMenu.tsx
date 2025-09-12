import { Home, FileText, Heart, Users, Clock } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface NavigationMenuProps {
  isCompact?: boolean;
}

export function NavigationMenu({ isCompact }: NavigationMenuProps) {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Trang chủ", path: "/" },
    { icon: FileText, label: "Bài đăng của tôi", path: "/personal-posts" },
    { icon: Heart, label: "Yêu thích", path: "/favorites" },
    { icon: Users, label: "Danh sách theo dõi", path: "/following" },
    { icon: Clock, label: "Đã xem gần đây", path: "/recent" },
  ];

  return (
    <nav className="p-4">
      <ul
        className={`space-y-2 ${
          isCompact ? "flex flex-col items-center space-y-4" : ""
        }`}
      >
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              to={item.path}
              className={`flex items-center justify-${
                isCompact ? "center" : "start"
              } gap-3 px-3 py-2 rounded-md transition-colors ${
                location.pathname === item.path
                  ? "bg-blue-100 text-[var(--primary-color)]"
                  : "text-[var(--secondary-text-color)] hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {!isCompact && item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
