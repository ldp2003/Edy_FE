import React from "react";
import { Drawer, Select, Button, Input, DatePicker, Checkbox } from "antd";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;

export interface FilterField {
  type: "select" | "input" | "dateRange" | "date" | "checkbox" | "numberRange";
  key: string;
  label: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  value?: string | boolean | [number?, number?] | [string, string] | null;
  onChange: (
    value: string | boolean | [number?, number?] | [string, string] | null
  ) => void;
}

interface CommonFilterDrawerProps {
  title: string;
  visible: boolean;
  onClose: () => void;
  onApply?: () => void;
  onReset?: () => void;
  fields: FilterField[];
  loading?: boolean;
}

const CommonFilterDrawer: React.FC<CommonFilterDrawerProps> = ({
  title,
  visible,
  onClose,
  onApply,
  onReset,
  fields,
  loading,
}) => {
  const renderField = (field: FilterField) => {
    switch (field.type) {
      case "select":
        return (
          <Select
            placeholder={field.placeholder}
            value={typeof field.value === "string" ? field.value : undefined}
            onChange={(value) => field.onChange(value)}
            className="w-full"
            size="small"
            allowClear
          >
            {field.options?.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );

      case "input":
        return (
          <Input
            placeholder={field.placeholder}
            value={typeof field.value === "string" ? field.value : ""}
            onChange={(e) => field.onChange(e.target.value)}
            size="small"
          />
        );

      case "dateRange":
        return (
          <RangePicker
            className="w-full"
            format="YYYY-MM-DD"
            onChange={(_dates, dateStrings) => field.onChange(dateStrings)}
            placeholder={["Từ ngày", "Đến ngày"]}
            size="small"
          />
        );

      case "date":
        return (
          <DatePicker
            className="w-full"
            format="YYYY-MM-DD"
            value={
              typeof field.value === "string" && field.value
                ? dayjs(field.value)
                : null
            }
            onChange={(_, dateString) =>
              field.onChange(typeof dateString === "string" ? dateString : null)
            }
            placeholder={field.placeholder || "Chọn ngày"}
            size="small"
            allowClear
          />
        );

      case "checkbox":
        return (
          <Checkbox
            checked={typeof field.value === "boolean" ? field.value : false}
            onChange={(e) => field.onChange(e.target.checked)}
          >
            {field.label}
          </Checkbox>
        );

      case "numberRange": {
        const numberRangeValue = Array.isArray(field.value)
          ? (field.value as [number?, number?])
          : [undefined, undefined];
        return (
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Từ"
              size="small"
              className="flex-1"
              type="number"
              value={numberRangeValue[0]?.toString() || ""}
              onChange={(e) =>
                field.onChange([
                  e.target.value ? parseInt(e.target.value) : undefined,
                  numberRangeValue[1],
                ])
              }
            />
            <span className="text-gray-500">-</span>
            <Input
              placeholder="Đến"
              size="small"
              className="flex-1"
              type="number"
              value={numberRangeValue[1]?.toString() || ""}
              onChange={(e) =>
                field.onChange([
                  numberRangeValue[0],
                  e.target.value ? parseInt(e.target.value) : undefined,
                ])
              }
            />
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <Drawer
      title={title}
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
      footer={
        <div className="flex justify-between">
          <Button onClick={onReset} disabled={loading}>
            Đặt lại
          </Button>
          <div className="flex gap-2">
            <Button onClick={onClose} disabled={loading}>
              Đóng
            </Button>
            <Button
              type="primary"
              className="bg-blue-500 hover:bg-blue-600"
              onClick={onApply}
              loading={loading}
            >
              Áp dụng bộ lọc
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.key}>
            {field.type !== "checkbox" && (
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}:
              </label>
            )}
            {renderField(field)}
          </div>
        ))}
      </div>
    </Drawer>
  );
};

export default CommonFilterDrawer;
