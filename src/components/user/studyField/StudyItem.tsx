import React from "react";
import { Edit, Trash, Check, X } from "lucide-react";
import { Input } from "antd";

type StudyItemProps = {
  title: string;
  isEditing?: boolean;
  editingValue?: string;
  onEdit?: () => void;
  onSaveEdit?: () => void;
  onCancelEdit?: () => void;
  onDelete?: () => void;
  onEditingValueChange?: (value: string) => void;
};

const StudyItem: React.FC<StudyItemProps> = ({
  title,
  isEditing = false,
  editingValue = "",
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onEditingValueChange,
}) => {
  if (isEditing) {
    return (
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b gap-2">
        <Input
          value={editingValue}
          onChange={(e) => onEditingValueChange?.(e.target.value)}
          className="flex-1 w-full sm:w-auto"
          onPressEnter={onSaveEdit}
          size="small"
        />
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            className="text-green-600 hover:text-green-700 cursor-pointer p-1"
            onClick={onSaveEdit}
          >
            <Check size={20} />
          </button>
          <button
            className="text-gray-600 hover:text-gray-700 cursor-pointer p-1"
            onClick={onCancelEdit}
          >
            <X size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center py-4 border-b">
      <span className="text-gray-800 text-sm">{title}</span>
      <div className="flex items-center gap-2">
        <button
          className="hover:text-blue-700 cursor-pointer"
          style={{ color: "var(--primary-color)" }}
          onClick={onEdit}
        >
          <Edit size={20} />
        </button>
        <button
          className="hover:text-red-700 cursor-pointer"
          style={{ color: "var(--red-button-color)" }}
          onClick={onDelete}
        >
          <Trash size={20} />
        </button>
      </div>
    </div>
  );
};

export default StudyItem;
