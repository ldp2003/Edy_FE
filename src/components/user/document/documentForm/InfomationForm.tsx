import { useState, useEffect } from "react";
import { Form, Input, Select, InputNumber, Button, message } from "antd";
import { Plus, Minus } from "lucide-react";

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
  privacy: string;
  saveData: boolean;
}

interface FileInfo {
  url: string;
  originalName: string;
  size: number;
  type: string;
}

interface InformationFormProps {
  fileInfo?: FileInfo;
}

const InformationForm = ({ fileInfo }: InformationFormProps) => {
  const [form] = Form.useForm();
  const [authors, setAuthors] = useState<string[]>([""]);

  // Auto-fill form when file is uploaded
  useEffect(() => {
    if (fileInfo) {
      const fileName = fileInfo.originalName;
      const nameWithoutExtension = fileName.substring(
        0,
        fileName.lastIndexOf(".")
      );

      // Auto-detect document type based on filename
      const getDocumentType = (fileName: string): string => {
        const name = fileName.toLowerCase();
        if (name.includes("báo cáo") || name.includes("report"))
          return "research-report";
        if (name.includes("đề cương") || name.includes("outline"))
          return "study-guide";
        if (name.includes("giáo trình") || name.includes("textbook"))
          return "textbook";
        if (name.includes("tiểu luận") || name.includes("essay"))
          return "essay";
        if (name.includes("bài giải") || name.includes("solution"))
          return "solution-set";
        if (name.includes("luận văn") || name.includes("thesis"))
          return "thesis";
        if (name.includes("bài giảng") || name.includes("lecture"))
          return "lecture";
        return "other";
      };

      // Auto-fill form fields
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

  const onFinish = (values: FormData) => {
    if (!fileInfo) {
      message.error("Vui lòng tải lên file trước khi đăng tải!");
      return;
    }

    const submitData = {
      ...values,
      fileUrl: fileInfo.url,
      fileSize: fileInfo.size,
      fileType: fileInfo.type,
    };

    console.log("Form data:", submitData);
    message.success("Đăng tải thành công!");
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

  return (
    <div className="py-6  min-h-screen text-left">
      <div className="font-bold text-base mb-6 text-[var(--primary-text-color)]">
        Nhập thông tin
      </div>
      <div className="mx-auto bg-white rounded-lg shadow-sm p-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{
            privacy: "private",
            saveData: false,
            authors: authors,
          }}
        >
          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: "290px 1fr 1fr" }}
          >
            {/* Column 1 - Image and privacy */}
            <div className="space-y-4">
              <div className="mb-0">
                <img
                  src={
                    fileInfo
                      ? fileInfo.url
                      : "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                  }
                  alt="Document preview"
                  className="border border-gray-200 rounded object-cover"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {fileInfo ? formatFileSize(fileInfo.size) : "16.8KB"}
                </div>
              </div>

              <Form.Item
                style={{ marginBottom: 5 }}
                name="privacy"
                label={<span className="text-xs">Riêng tư</span>}
                rules={[
                  { required: true, message: "Vui lòng chọn quyền riêng tư!" },
                ]}
              >
                <Select>
                  <Option value="private">Riêng tư</Option>
                  <Option value="public">Công khai</Option>
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
                <Input placeholder="Nhập tên tài liệu" />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 13.5 }}
                name="subject"
                label={<span className="text-xs">Môn học</span>}
                rules={[{ required: true, message: "Vui lòng nhập môn học!" }]}
              >
                <Input placeholder="Nhập môn học" />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 13.5 }}
                name="organization"
                label={<span className="text-xs">Tổ chức</span>}
                rules={[{ required: true, message: "Vui lòng nhập tổ chức!" }]}
              >
                <Input placeholder="Tổ chức" />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 13.5 }}
                name="documentType"
                label={<span className="text-xs">Loại tài liệu</span>}
                rules={[
                  { required: true, message: "Vui lòng chọn loại tài liệu!" },
                ]}
              >
                <Select placeholder="Loại tài liệu">
                  <Option value="research-report">
                    Báo cáo nghiên cứu khoa học
                  </Option>
                  <Option value="video">Video</Option>
                  <Option value="study-guide">Đề cương ôn tập</Option>
                  <Option value="textbook">Giáo trình</Option>
                  <Option value="essay">Tiểu luận</Option>
                  <Option value="solution-set">Bài giải</Option>
                  <Option value="thesis">Luận văn / Khóa luận</Option>
                  <Option value="lecture">Bài giảng</Option>
                  <Option value="other">Khác</Option>
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
                  <Select placeholder="Chọn trình độ">
                    <Option value="student">Học sinh</Option>
                    <Option value="university-student">
                      Sinh viên (ĐH/CĐ)
                    </Option>
                    <Option value="teacher">Giảng viên</Option>
                    <Option value="researcher">Nghiên cứu sinh</Option>
                    <Option value="other">Khác</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>

            {/* Column 3 - Keywords */}
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
              {/* Left side - 2 columns for form fields */}
              <div className="col-span-2 grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Form.Item
                    style={{ marginBottom: 5 }}
                    name="publisher"
                    label="Nhà xuất bản"
                  >
                    <Input placeholder="Nhà xuất bản" />
                  </Form.Item>

                  <Form.Item
                    style={{ marginBottom: 5 }}
                    name="publishYear"
                    label="Năm xuất bản"
                  >
                    <Input placeholder="Năm xuất bản" />
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
                      />
                      {idx > 0 && (
                        <Button
                          type="text"
                          icon={<Minus size={16} />}
                          onClick={() => removeAuthor(idx)}
                          className="p-2"
                        />
                      )}
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    icon={<Plus size={16} />}
                    onClick={addAuthor}
                    className="w-12 h-10"
                  />
                </div>
              </div>

              {/* Right side - Summary textarea */}
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
                    placeholder="Nhập các từ khóa liên quan đến tài liệu vào đây"
                    rows={5}
                    style={{ resize: "none" }}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <div className="flex gap-3">
              <Button onClick={() => form.resetFields()}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Đăng tải
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default InformationForm;
