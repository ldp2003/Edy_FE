import { useState, useEffect } from "react";
import { Form, Input, Select, InputNumber, Button, message } from "antd";
import { Plus, Minus } from "lucide-react";
import { DocumentAPI } from "../../../../api/API";

const { TextArea } = Input;
const { Option } = Select;

interface FormData {
  documentName: string;
  subject: string;
  organization: string;
  documentType: string;
  pageCount?: number;
  level: string;
  keywords: string;
  publisher?: string;
  publishYear?: string;
  authors: string[];
  summary: string;
  public_mode: string;
  saveData: boolean;
}

interface FileInfo {
  url: string;
  originalName: string;
  size: number;
  type: string;
  thumbnail?: string;
}

interface InformationFormProps {
  fileInfo?: FileInfo;
  isUploading?: boolean;
  onUploadSuccess?: () => void;
}

const InformationForm = ({
  fileInfo,
  isUploading,
  onUploadSuccess,
}: InformationFormProps) => {
  const [form] = Form.useForm();
  const [authors, setAuthors] = useState<string[]>([""]);
  const [submitting, setSubmitting] = useState(false);

  // Auto-fill form when file is uploaded
  useEffect(() => {
    if (fileInfo) {
      const fileName = fileInfo.originalName;
      const nameWithoutExtension = fileName.substring(
        0,
        fileName.lastIndexOf(".")
      );

      const getDocumentType = (fileName: string): string => {
        const name = fileName.toLowerCase();
        if (name.includes("báo cáo") || name.includes("report"))
          return "RESEARCH_REPORT";
        if (name.includes("đề cương") || name.includes("outline"))
          return "STUDY_GUIDE";
        if (name.includes("giáo trình") || name.includes("textbook"))
          return "TEXTBOOK";
        if (name.includes("tiểu luận") || name.includes("essay"))
          return "ESSAY";
        if (name.includes("bài giải") || name.includes("solution"))
          return "SOLUTION_SET";
        if (name.includes("luận văn") || name.includes("thesis"))
          return "THESIS";
        if (name.includes("bài giảng") || name.includes("lecture"))
          return "LECTURE";
        return "OTHER";
      };

      form.setFieldsValue({
        documentName: nameWithoutExtension,
        documentType: getDocumentType(fileName),
      });

      message.success(`Đã tải lên thành công file: ${fileName}`);
    }
  }, [fileInfo, form]);

  const addAuthor = () => {
    setAuthors([...authors, ""]);
  };

  const removeAuthor = (index: number) => {
    const newAuthors = authors.filter((_, i) => i !== index);
    setAuthors(newAuthors);
    form.setFieldsValue({ authors: newAuthors });
  };

  const updateAuthor = (index: number, value: string) => {
    const newAuthors = [...authors];
    newAuthors[index] = value;
    setAuthors(newAuthors);
    form.setFieldsValue({ authors: newAuthors });
  };

  const onFinish = async (values: FormData) => {
    if (!fileInfo) {
      message.error("Vui lòng tải lên file trước khi đăng tải!");
      return;
    }

    if (isUploading) {
      message.warning("Vui lòng đợi file tải lên hoàn tất!");
      return;
    }

    setSubmitting(true);

    try {
      // Chuẩn bị dữ liệu theo format API
      const documentData = {
        url: fileInfo.url,
        title: values.documentName,
        doc_type: values.documentType,
        file_type: fileInfo.type,
        subject: values.subject,
        author: authors.filter((author) => author.trim() !== ""),
        published_year: values.publishYear
          ? parseInt(values.publishYear)
          : undefined,
        publisher: values.publisher,
        organization: values.organization,
        level: values.level,
        public_mode: values.public_mode,
        keyword: values.keywords
          ? values.keywords.split(",").map((k) => k.trim())
          : [],
        description: values.summary,
        page: values.pageCount,
      };

      const response = await DocumentAPI.uploadDocument(documentData);

      if (response.status !== 201) {
        throw new Error("Đăng tải tài liệu thất bại!");
      }

      message.success("Đăng tải tài liệu thành công!");

      // Reset form sau khi thành công
      form.resetFields();
      setAuthors([""]);

      if (onUploadSuccess) {
        onUploadSuccess();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Document upload error:", error);

      if (error.response?.data?.message) {
        message.error(`Lỗi: ${error.response.data.message}`);
      } else if (error.message) {
        message.error(`Lỗi: ${error.message}`);
      } else {
        message.error("Có lỗi xảy ra khi đăng tải tài liệu!");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo);
    message.error("Vui lòng kiểm tra lại thông tin!");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getPreviewImage = () => {
    if (fileInfo?.thumbnail) {
      return fileInfo.thumbnail;
    }

    if (
      fileInfo?.type === "PDF" &&
      fileInfo?.url &&
      typeof fileInfo.url === "string"
    ) {
      return fileInfo.url.replace(
        "/upload/",
        "/upload/c_thumb,w_300,h_400,f_jpg/"
      );
    }

    if (
      fileInfo?.type === "WORD" &&
      fileInfo?.url &&
      typeof fileInfo.url === "string"
    ) {
      // For Word documents without thumbnail, show document icon
      return "https://cdn-icons-png.flaticon.com/512/337/337946.png";
    }

    if (fileInfo?.url && typeof fileInfo.url === "string") {
      return fileInfo.url;
    }

    return "https://cdn-icons-png.flaticon.com/512/2425/2425541.png";
  };

  // Determine if submit button should be disabled
  const isSubmitDisabled = !fileInfo || isUploading || submitting;

  return (
    <div className="py-6 min-h-screen text-left">
      <div className="font-bold text-base mb-6 text-[var(--primary-text-color)]">
        Nhập thông tin
        {isUploading && (
          <span className="ml-2 text-sm text-orange-500 font-normal">
            (Đang tải file...)
          </span>
        )}
      </div>
      <div className="mx-auto bg-white rounded-lg shadow-sm p-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{
            public_mode: "PUBLIC",
            saveData: false,
            authors: authors,
          }}
        >
          {/* Rest of the form JSX remains the same... */}
          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: "290px 1fr 1fr" }}
          >
            {/* Column 1 - Image and privacy */}
            <div className="space-y-4">
              <div className="mb-0">
                <img
                  src={getPreviewImage()}
                  alt="Document preview"
                  className={`border border-gray-200 rounded object-cover ${
                    isUploading ? "opacity-50" : ""
                  }`}
                  style={{ maxHeight: "300px" }}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {fileInfo ? formatFileSize(fileInfo.size) : "Chưa có file"}
                </div>
                {isUploading && (
                  <div className="text-xs text-orange-500 mt-1 animate-pulse">
                    Đang tải lên...
                  </div>
                )}
              </div>

              <Form.Item
                style={{ marginBottom: 5 }}
                name="public_mode"
                label={<span className="text-xs">Chế độ công khai</span>}
                rules={[
                  { required: true, message: "Vui lòng chọn quyền riêng tư!" },
                ]}
              >
                <Select disabled={isUploading}>
                  <Option value="PUBLIC">Công khai</Option>
                  <Option value="PRIVATE">Riêng tư</Option>
                </Select>
              </Form.Item>
            </div>

            {/* Column 2 - Main form fields */}
            <div className="space-y-4">
              <Form.Item
                style={{ marginBottom: 13.5 }}
                name="documentName"
                label={<span className="text-xs">Tên tài liệu</span>}
                rules={[
                  { required: true, message: "Vui lòng nhập tên tài liệu!" },
                ]}
              >
                <Input placeholder="Nhập tên tài liệu" disabled={isUploading} />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 13.5 }}
                name="subject"
                label={<span className="text-xs">Môn học</span>}
                rules={[{ required: true, message: "Vui lòng nhập môn học!" }]}
              >
                <Input placeholder="Nhập môn học" disabled={isUploading} />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 13.5 }}
                name="organization"
                label={<span className="text-xs">Tổ chức</span>}
                rules={[{ required: true, message: "Vui lòng nhập tổ chức!" }]}
              >
                <Input placeholder="Tổ chức" disabled={isUploading} />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 13.5 }}
                name="documentType"
                label={<span className="text-xs">Loại tài liệu</span>}
                rules={[
                  { required: true, message: "Vui lòng chọn loại tài liệu!" },
                ]}
              >
                <Select placeholder="Loại tài liệu" disabled={isUploading}>
                  <Option value="RESEARCH_REPORT">
                    Báo cáo nghiên cứu khoa học
                  </Option>
                  <Option value="VIDEO">Video</Option>
                  <Option value="STUDY_GUIDE">Đề cương ôn tập</Option>
                  <Option value="TEXTBOOK">Giáo trình</Option>
                  <Option value="ESSAY">Tiểu luận</Option>
                  <Option value="SOLUTION_SET">Bài giải</Option>
                  <Option value="THESIS">Luận văn / Khóa luận</Option>
                  <Option value="LECTURE">Bài giảng</Option>
                  <Option value="OTHER">Khác</Option>
                </Select>
              </Form.Item>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  style={{ marginBottom: 13.5 }}
                  name="pageCount"
                  label={<span className="text-xs">Số trang</span>}
                >
                  <InputNumber
                    min={1}
                    className="w-full"
                    placeholder="Số trang"
                    style={{ width: "100%" }}
                    disabled={isUploading}
                  />
                </Form.Item>

                <Form.Item
                  style={{ marginBottom: 13.5 }}
                  name="level"
                  label={<span className="text-xs">Trình độ</span>}
                  rules={[
                    { required: true, message: "Vui lòng chọn trình độ!" },
                  ]}
                >
                  <Select placeholder="Chọn trình độ" disabled={isUploading}>
                    <Option value="STUDENT">Học sinh</Option>
                    <Option value="UNIVERSITY">Sinh viên (ĐH/CĐ)</Option>
                    <Option value="LECTURER">Giảng viên</Option>
                    <Option value="RESEARCHER">Nghiên cứu sinh</Option>
                    <Option value="OTHER">Khác</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>

            {/* Column 3 - Summary */}
            <div>
              <Form.Item
                style={{ marginBottom: 5 }}
                name="summary"
                label={<span className="text-xs">Tóm tắt</span>}
                rules={[{ required: true, message: "Vui lòng nhập tóm tắt!" }]}
              >
                <TextArea
                  placeholder="Nhập mô tả hoặc tóm tắt tài liệu vào đây"
                  rows={15}
                  style={{ resize: "none", borderColor: "#60a5fa" }}
                  disabled={isUploading}
                />
              </Form.Item>
            </div>
          </div>

          {/* Thông tin khác */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="font-semibold text-base mb-4 text-gray-800">
              Thông tin khác
            </div>
            <div
              className="grid gap-6"
              style={{ gridTemplateColumns: "290px 1fr 1fr" }}
            >
              <div className="col-span-2 grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Form.Item
                    style={{ marginBottom: 5 }}
                    name="publisher"
                    label="Nhà xuất bản"
                  >
                    <Input placeholder="Nhà xuất bản" disabled={isUploading} />
                  </Form.Item>

                  <Form.Item
                    style={{ marginBottom: 5 }}
                    name="publishYear"
                    label="Năm xuất bản"
                  >
                    <Input placeholder="Năm xuất bản" disabled={isUploading} />
                  </Form.Item>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tác giả tài liệu
                  </label>
                  {authors.map((author, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <Input
                        value={author}
                        onChange={(e) => updateAuthor(idx, e.target.value)}
                        placeholder="Tác giả tài liệu"
                        className="flex-1"
                        disabled={isUploading}
                      />
                      {idx > 0 && (
                        <Button
                          type="text"
                          icon={<Minus size={16} />}
                          onClick={() => removeAuthor(idx)}
                          className="p-2"
                          disabled={isUploading}
                        />
                      )}
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    icon={<Plus size={16} />}
                    onClick={addAuthor}
                    className="w-12 h-10"
                    disabled={isUploading}
                  />
                </div>
              </div>

              <div>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="keywords"
                  label={<span className="text-xs">Từ khóa</span>}
                  rules={[
                    { required: true, message: "Vui lòng nhập từ khóa!" },
                  ]}
                >
                  <TextArea
                    placeholder="Nhập các từ khóa liên quan đến tài liệu vào đây (phân cách bằng dấu phẩy)"
                    rows={5}
                    style={{ resize: "none" }}
                    disabled={isUploading}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <div className="flex gap-3">
              <Button
                onClick={() => form.resetFields()}
                disabled={isUploading || submitting}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                disabled={isSubmitDisabled}
              >
                {submitting
                  ? "Đang đăng tải..."
                  : isUploading
                  ? "Đang tải file..."
                  : "Đăng tải"}
              </Button>
            </div>
            {isSubmitDisabled && !submitting && (
              <div className="text-xs text-gray-500">
                {!fileInfo
                  ? "Vui lòng tải lên file trước"
                  : isUploading
                  ? "Đang tải file lên..."
                  : ""}
              </div>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default InformationForm;
