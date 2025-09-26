import React from "react";
import { Form, Radio, Input } from "antd";

const { TextArea } = Input;

interface PendingRequest {
  _id: string;
  doc: string;
  requester: string;
  is_summary: boolean;
  status: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentSummaryProps {
  summaryRequest: PendingRequest | null;
  summaryAction: "approve" | "reject";
  summaryRejectReason: string;
  onSummaryActionChange: (action: "approve" | "reject") => void;
  onSummaryRejectReasonChange: (reason: string) => void;
}

const DocumentSummary: React.FC<DocumentSummaryProps> = ({
  summaryRequest,
  summaryAction,
  summaryRejectReason,
  onSummaryActionChange,
  onSummaryRejectReasonChange,
}) => {
  return (
    <div>
      <Form.Item
        style={{ marginBottom: 5 }}
        name="summary"
        label={<span className="text-xs">Tóm tắt</span>}
      >
        <TextArea
          placeholder="Nhập mô tả hoặc tóm tắt tài liệu vào đây"
          rows={15}
          style={{ resize: "none", borderColor: "#60a5fa" }}
          disabled
        />
      </Form.Item>

      {/* Summary approval section - only show if there's a summary request */}
      {summaryRequest && (
        <div className="mt-4 border border-blue-200 rounded-xl overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
            <div className="flex items-center text-white">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-semibold">Tóm tắt cần duyệt</span>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white p-4 space-y-4">
            <Radio.Group
              value={summaryAction}
              onChange={(e) => {
                onSummaryActionChange(e.target.value);
                if (e.target.value === "approve") {
                  onSummaryRejectReasonChange("");
                }
              }}
              className="w-full"
            >
              <div className="grid gap-3">
                {/* Approve Option - Expanded clickable area */}
                <label
                  className="flex items-center p-3 border border-green-200 rounded-lg hover:bg-green-50 transition-all cursor-pointer w-full"
                  htmlFor="approve-radio"
                >
                  <Radio
                    id="approve-radio"
                    value="approve"
                    className="text-sm pointer-events-none"
                  >
                    <span className="flex items-center font-medium text-green-700 pointer-events-none">
                      Duyệt tóm tắt
                    </span>
                  </Radio>
                </label>

                {/* Reject Option - Expanded clickable area */}
                <label
                  className="flex items-center p-3 border border-red-200 rounded-lg hover:bg-red-50 transition-all cursor-pointer w-full"
                  htmlFor="reject-radio"
                >
                  <Radio
                    id="reject-radio"
                    value="reject"
                    className="text-sm pointer-events-none"
                  >
                    <span className="flex items-center font-medium text-red-700 pointer-events-none">
                      Từ chối tóm tắt
                    </span>
                  </Radio>
                </label>
              </div>
            </Radio.Group>

            {/* Rejection reason */}
            {summaryAction === "reject" && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <label className="block text-sm font-semibold text-red-800 mb-2">
                  Lý do từ chối:
                </label>
                <TextArea
                  rows={3}
                  value={summaryRejectReason}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    onSummaryRejectReasonChange(e.target.value)
                  }
                  placeholder="Vui lòng nhập lý do cụ thể..."
                  style={{ resize: "none" }}
                  className="border-red-300 focus:border-red-400 focus:ring-red-200"
                />
              </div>
            )}

            {/* Status badge */}
            <div className="flex justify-end mt-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  summaryAction === "approve"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {summaryAction === "approve"
                  ? "Sẽ được duyệt"
                  : "Sẽ bị từ chối"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentSummary;
