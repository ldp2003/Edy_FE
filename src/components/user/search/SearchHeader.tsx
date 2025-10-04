import React, { useState, useEffect } from "react";
import { Input, Button } from "antd";
import { Search } from "lucide-react";

interface SearchHeaderProps {
  initialQuery: string;
  onSearch: (query: string) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  initialQuery,
  onSearch,
}) => {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = () => {
    onSearch(query.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Tìm kiếm tài liệu
        </h1>
        <p className="text-gray-600">
          Khám phá kho tàng tài liệu học tập phong phú
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="relative">
          <Input
            size="large"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập từ khóa tìm kiếm: Tên tài liệu, trường, môn học, tác giả..."
            prefix={<Search className="text-gray-400 w-4 h-4" />}
            suffix={
              <Button
                type="primary"
                onClick={handleSearch}
                className="border-0 shadow-none"
              >
                Tìm kiếm
              </Button>
            }
            className="pr-0"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
