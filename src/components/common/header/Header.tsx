import { Search, Bell } from "lucide-react";
import logo from "/public/image/Logo.png";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 fixed left-0 top-0 w-full z-20">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center">
            <img src={logo} alt="Logo" />
          </div>
          <span className="text-5xl font-bold bg-gradient-to-b from-[#50C4FE] to-[#3586DB] bg-clip-text text-transparent">
            EDY
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              placeholder="Nhập từ khóa tìm kiếm: Tên tài liệu, trường, môn học, tác giả..."
              className="pl-10 pr-24 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 text-sm rounded transition-colors">
              Tìm kiếm
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <img
                src="/placeholder.svg?height=32&width=32"
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const sibling = e.currentTarget
                    .nextElementSibling as HTMLElement | null;
                  if (sibling) {
                    sibling.style.display = "flex";
                  }
                }}
              />
              <span className="text-xs font-medium text-gray-600 hidden">
                NA
              </span>
            </div>
            <span className="text-sm font-medium text-blue-600">
              NGUYEN VAN A
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
