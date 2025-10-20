import React, { useState, useEffect } from "react";
import { Input, Button, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const SearchScopeInput: React.FC<{
  onFieldOfStudyChange: (field: string) => void;
}> = ({ onFieldOfStudyChange }) => {
  const [scopes, setScopes] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    onFieldOfStudyChange(scopes.join(","));
  }, [scopes, onFieldOfStudyChange]);

  const handleAddScope = () => {
    if (inputValue.trim() && !scopes.includes(inputValue.trim())) {
      setScopes([...scopes, inputValue.trim()]); 
      setInputValue("");
    }
  };

  const handleRemoveScope = (removedScope: string) => {
    setScopes(scopes.filter((scope) => scope !== removedScope));
  };

  return (
    <div>
      <label className="block text-lg font-bold mb-2">
        Nhập phạm vi tìm kiếm của bạn
      </label>
      <div className="flex items-center gap-2 mb-4">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={handleAddScope}
          placeholder="Nhập phạm vi và nhấn Enter"
          style={{ flex: 1 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddScope}>
          Thêm
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {scopes.map((scope) => (
          <Tag
            closable
            key={scope}
            onClose={() => handleRemoveScope(scope)}
            color="blue"
          >
            {scope}
          </Tag>
        ))}
      </div>
    </div>
  );
};

export default SearchScopeInput;
