import { Home, FileText, Heart, Users, Clock } from "lucide-react";

interface NavigationMenuProps {
  isCompact?: boolean;
}

export function NavigationMenu({ isCompact }: NavigationMenuProps) {
  const menuItems = [
    { icon: Home, label: "Trang chủ", active: true },
    { icon: FileText, label: "Bài đăng của tôi" },
    { icon: Heart, label: "Yêu thích" },
    { icon: Users, label: "Danh sách theo dõi" },
    { icon: Clock, label: "Đã xem gần đây" },
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
            <button
              className={`flex items-center justify-${
                isCompact ? "center" : "start"
              } gap-3 px-3 py-2 rounded-md transition-colors ${
                item.active
                  ? "bg-blue-100 text-blue-700"
                  : "text-[var(--secondary-text-color)] hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {!isCompact && item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
