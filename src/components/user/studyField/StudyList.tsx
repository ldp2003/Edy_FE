import React, { useState, useContext, useEffect } from "react";
import StudyItem from "./StudyItem";
import { UserContext } from "../../../contexts/UserContext";
import { UserService } from "../../../utils/UserService";
import { message, Input, Button } from "antd";
import { Plus, Save, X } from "lucide-react";

type StudyListProps = {
  fieldOfStudy: string[];
};

const StudyList: React.FC<StudyListProps> = ({ fieldOfStudy }) => {
  const { user, setUser } = useContext(UserContext);
  const [originalFields, setOriginalFields] = useState<string[]>(fieldOfStudy);
  const [fields, setFields] = useState<string[]>(fieldOfStudy);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newField, setNewField] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    setOriginalFields(fieldOfStudy);
    setFields(fieldOfStudy);
    setHasChanges(false);
  }, [fieldOfStudy]);

  const markAsChanged = () => {
    setHasChanges(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditingValue(fields[index]);
  };

  const handleSaveEdit = () => {
    if (!editingValue.trim()) {
      messageApi.error("Tên lĩnh vực không được để trống");
      return;
    }

    const updatedFields = [...fields];
    updatedFields[editingIndex!] = editingValue.trim();
    setFields(updatedFields);
    markAsChanged();
    setEditingIndex(null);
    setEditingValue("");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue("");
  };

  const handleDelete = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
    markAsChanged();
  };

  const handleAdd = () => {
    setIsAdding(true);
    setNewField("");
  };

  const handleSaveAdd = () => {
    if (!newField.trim()) {
      messageApi.error("Tên lĩnh vực không được để trống");
      return;
    }

    if (fields.includes(newField.trim())) {
      messageApi.error("Lĩnh vực này đã tồn tại");
      return;
    }

    const updatedFields = [...fields, newField.trim()];
    setFields(updatedFields);
    markAsChanged();
    setIsAdding(false);
    setNewField("");
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewField("");
  };

  const handleSaveAll = async () => {
    // Validation
    if (fields.length === 0) {
      messageApi.error("Phải có ít nhất 1 lĩnh vực học");
      return;
    }

    const trimmedFields = fields.map((f) => f.trim());
    if (trimmedFields.some((f) => !f)) {
      messageApi.error("Tên lĩnh vực không được để trống");
      return;
    }

    const uniqueFields = [...new Set(trimmedFields)];
    if (uniqueFields.length !== trimmedFields.length) {
      messageApi.error("Không được có tên lĩnh vực trùng nhau");
      return;
    }

    try {
      await UserService.updateFieldOfStudy(uniqueFields);
      setOriginalFields(uniqueFields);
      setUser({ ...user!, field_of_study: uniqueFields });
      setHasChanges(false);
      messageApi.success("Cập nhật lĩnh vực học thành công");
    } catch (error) {
      console.error("Failed to update field of study:", error);
      messageApi.error("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  const handleCancelAll = () => {
    setFields([...originalFields]);
    setEditingIndex(null);
    setEditingValue("");
    setIsAdding(false);
    setNewField("");
    setHasChanges(false);
  };

  return (
    <div
      className="h-full p-4 rounded-lg"
      style={{ backgroundColor: "var(--card-background-color)" }}
    >
      {contextHolder}
      {fields.map((item, index) => (
        <StudyItem
          key={index}
          title={item}
          isEditing={editingIndex === index}
          editingValue={editingValue}
          onEdit={() => handleEdit(index)}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
          onDelete={() => handleDelete(index)}
          onEditingValueChange={setEditingValue}
        />
      ))}

      {isAdding && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b gap-2">
          <Input
            value={newField}
            onChange={(e) => setNewField(e.target.value)}
            placeholder="Nhập tên lĩnh vực"
            className="flex-1 w-full sm:w-auto"
            onPressEnter={handleSaveAdd}
            size="small"
          />
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              className="text-green-600 hover:text-green-700 cursor-pointer text-sm px-2 py-1"
              onClick={handleSaveAdd}
            >
              Lưu
            </button>
            <button
              className="text-gray-600 hover:text-gray-700 cursor-pointer text-sm px-2 py-1"
              onClick={handleCancelAdd}
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {!isAdding && (
        <div className="flex justify-center py-4">
          <button
            className="flex items-center gap-2 hover:underline text-sm"
            style={{ color: "var(--primary-color)" }}
            onClick={handleAdd}
          >
            <Plus size={16} />
            Thêm lĩnh vực
          </button>
        </div>
      )}

      {hasChanges && (
        <div className="flex flex-col sm:flex-row justify-center gap-4 py-4 border-t mt-4">
          <Button
            type="primary"
            icon={<Save size={16} />}
            onClick={handleSaveAll}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            Lưu thay đổi
          </Button>
          <Button
            icon={<X size={16} />}
            onClick={handleCancelAll}
            className="w-full sm:w-auto"
          >
            Hủy
          </Button>
        </div>
      )}
    </div>
  );
};

export default StudyList;
