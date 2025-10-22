import React from "react";
import { Form, Input, Button } from "antd";
import { Plus, Minus } from "lucide-react";

const { TextArea } = Input;

interface DocumentAdditionalInfoProps {
  authors: string[];
  onAuthorsChange: (authors: string[]) => void;
}

const DocumentAdditionalInfo: React.FC<DocumentAdditionalInfoProps> = ({
  authors,
  onAuthorsChange,
}) => {
  const addAuthor = () => {
    onAuthorsChange([...authors, ""]);
  };

  const removeAuthor = (index: number) => {
    if (authors.length > 1) {
      const newAuthors = authors.filter((_, idx) => idx !== index);
      onAuthorsChange(newAuthors);
    }
  };

  const updateAuthor = (index: number, value: string) => {
    const newAuthors = [...authors];
    newAuthors[index] = value;
    onAuthorsChange(newAuthors);
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="font-semibold text-base mb-4 text-gray-800">
        Thông tin khác
      </div>

      {/* Responsive Grid Layout */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3 xl:grid-cols-3">
        {/* Left section - Publisher and Year */}
        <div className="space-y-4">
          <Form.Item
            style={{ marginBottom: 5 }}
            name="publisher"
            label="Nhà xuất bản"
          >
            <Input placeholder="Nhà xuất bản" disabled />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 5 }}
            name="publishYear"
            label="Năm xuất bản"
          >
            <Input placeholder="Năm xuất bản" disabled />
          </Form.Item>
        </div>

        {/* Middle section - Authors */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tác giả tài liệu
          </label>
          {authors.map((author, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <Input
                value={author}
                placeholder="Tác giả tài liệu"
                className="flex-1"
                disabled
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateAuthor(idx, e.target.value)
                }
              />
              <Button
                type="text"
                icon={<Minus size={16} />}
                className="p-2"
                disabled
                onClick={() => removeAuthor(idx)}
              />
            </div>
          ))}
          <Button
            type="dashed"
            icon={<Plus size={16} />}
            className="w-12 h-10"
            disabled
            onClick={addAuthor}
          />
        </div>

        {/* Right section - Keywords */}
        <div>
          <Form.Item
            style={{ marginBottom: 5 }}
            name="keywords"
            label={<span className="text-xs">Từ khóa</span>}
          >
            <TextArea
              placeholder="Nhập các từ khóa liên quan đến tài liệu vào đây (phân cách bằng dấu phẩy)"
              rows={5}
              style={{ resize: "none" }}
              disabled
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default DocumentAdditionalInfo;
