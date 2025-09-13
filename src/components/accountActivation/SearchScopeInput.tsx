import React, { useState } from "react";
import { Input, Button, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const SearchScopeInput: React.FC = () => {
  const [scopes, setScopes] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

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
      <label className="block text-gray-700 mb-2">Search scopes</label>
      <div className="flex items-center gap-2 mb-4">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={handleAddScope}
          placeholder="Enter a scope and press Enter"
          style={{ flex: 1 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddScope}>
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
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
