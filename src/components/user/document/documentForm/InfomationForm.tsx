/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useContext, useCallback } from "react";
import { Form, Input, Select, InputNumber, Button, message, Modal } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import { Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DocumentService } from "../../../../utils/DocumentService";
import { UserContext } from "../../../../contexts/UserContext";
import SubjectService from "../../../../utils/SubjectService";
import type { Subject } from "../../../../models/subject";
import { NotificationService } from "../../../../utils/NotificationService";

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
  pageCount?: number;
}

interface InformationFormProps {
  fileInfo?: FileInfo;
  isUploading?: boolean;
  onUploadSuccess?: () => void;
  messageApi?: MessageInstance;
}

const InformationForm = ({
  fileInfo,
  isUploading,
  onUploadSuccess,
  messageApi,
}: InformationFormProps) => {
  const [form] = Form.useForm();
  const [authors, setAuthors] = useState<string[]>([""]);
  const [submitting, setSubmitting] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newSubjectForm] = Form.useForm();
  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  // Load subjects when user organization is available
  const loadSubjects = useCallback(async () => {
    if (
      user?.organization &&
      typeof user.organization === "object" &&
      user.organization._id
    ) {
      setSubjectsLoading(true);
      try {
        const subjectsData = await SubjectService.getSubjectsByOrganization(
          user.organization._id
        );
        // console.log("Loaded subjects:", subjectsData);
        // console.log("First subject ID:", subjectsData[0]?._id);
        setSubjects(subjectsData);
      } catch (error) {
        console.error("Error loading subjects:", error);
        message.error("Không thể tải danh sách môn học");
      } finally {
        setSubjectsLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  // Set default organization when user is available
  useEffect(() => {
    if (user?.organization && typeof user.organization === "object") {
      form.setFieldsValue({
        organization: user.organization._id,
      });
    }
  }, [user, form]);

  // Auto-fill form when file is uploaded: khi fileInfo (được truyền từ UploadDocument qua UploadPage) thay đổi,
  // tự động điền các trường form dựa trên thông tin file:
  // - documentName: tên file không có extension
  // - documentType: đoán loại tài liệu dựa trên từ khóa trong tên file (báo cáo -> RESEARCH_REPORT, giáo trình -> TEXTBOOK, etc.)
  // - pageCount: điền số trang nếu có (từ PDF.js hoặc docx-preview)
  // - Hiển thị message success với tên file và số trang
  // Dependency: [fileInfo, form] - chạy lại khi fileInfo hoặc form thay đổi
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

      const formValues: Partial<FormData> = {
        documentName: nameWithoutExtension,
        documentType: getDocumentType(fileName),
      };

      // Auto-fill page count if available
      if (fileInfo.pageCount && fileInfo.pageCount > 0) {
        formValues.pageCount = fileInfo.pageCount;
        // console.log("Auto-filled page count:", fileInfo.pageCount);
      }

      form.setFieldsValue(formValues);

      message.success(
        `Đã tải lên thành công file: ${fileName}${
          fileInfo.pageCount ? ` (${fileInfo.pageCount} trang)` : ""
        }`
      );
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

  // Handle create new subject
  const handleCreateSubject = async (values: {
    name: string;
    code: string;
    description?: string;
  }) => {
    if (!user?.organization || typeof user.organization !== "object") {
      message.error("Không xác định được tổ chức của bạn");
      return;
    }

    const organizationId = user.organization._id;
    if (!organizationId) {
      message.error("Không xác định được ID tổ chức");
      return;
    }

    try {
      await SubjectService.createSubject({
        ...values,
        organization: organizationId,
      });

      message.success("Tạo môn học mới thành công!");

      // Close modal and reset form
      setIsModalVisible(false);
      newSubjectForm.resetFields();

      // Reload subjects list
      await loadSubjects();
    } catch (error) {
      console.error("Error creating subject:", error);
      message.error("Không thể tạo môn học mới");
    }
  };

  const showAddSubjectModal = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    newSubjectForm.resetFields();
  };

  const onFinish = async (values: FormData) => {
    // Hàm xử lý submit form đăng tải tài liệu:
    // - Kiểm tra fileInfo đã có (từ upload) và không đang upload
    // - Chuẩn bị documentData từ form values và fileInfo:
    //   + url: fileInfo.url (Cloudinary URL)
    //   + title: values.documentName
    //   + doc_type: values.documentType
    //   + file_type: fileInfo.type (PDF, WORD, etc.)
    //   + subject, author (filtered), published_year, publisher, organization, level, public_mode
    //   + keyword: split từ values.keywords
    //   + description: values.summary
    //   + page: fileInfo.pageCount
    //   + cover_page: fileInfo.thumbnail
    // - Gọi DocumentService.uploadDocument(documentData) để upload lên server
    // - Nếu thành công (status 201), gửi notification đến admin, reset form, gọi onUploadSuccess, navigate đến /personal-posts
    // - Xử lý lỗi: hiển thị message error dựa trên response status (401, 403, 404, etc.)
    // Tham số: values - dữ liệu từ form (FormData interface)
    // console.log("Form values received:", values);
    // console.log("Subject value:", values.subject);

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
        url: fileInfo.url, // Original Cloudinary URL for submission
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
        cover_page: fileInfo.thumbnail,
      };

      // console.log("Document data being submitted:", documentData);
      // console.log("Original file URL:", fileInfo.url);
      // console.log("Thumbnail URL (for display):", fileInfo.thumbnail);

      const response = await DocumentService.uploadDocument(documentData);

      // Kiểm tra status 201 để xác nhận tải lên thành công
      // console.log("Upload response:", response);
      if (response.status === 201) {
        // Sử dụng messageApi được truyền từ parent hoặc fallback về message global
        const showMessage = messageApi || message;

        showMessage.success("🎉 Đăng tải tài liệu thành công!");

        // console.log("Uploaded document ID:", response.document._id);
        // Gửi thông báo đến admin sau khi tải tài liệu thành công
        try {
          const senderName =
            `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
            "Người dùng không xác định";
          const senderId = user?._id || "";

          await NotificationService.createNotification({
            userId: "68c37e4014c04e538b78c890", // ID của admin
            type: "SYSTEM", // Loại thông báo
            message: `Tài liệu mới đã được tải lên: ${values.documentName} bởi ${senderName} (ID: ${senderId})`,
            docId: response.document._id, // ID tài liệu mới
          });
          // console.log("Thông báo đã được gửi đến admin.");
        } catch (notificationError) {
          console.error(
            "Không thể gửi thông báo đến admin:",
            notificationError
          );
        }

        // Reset form sau khi thành công
        form.resetFields();
        setAuthors([""]);

        if (onUploadSuccess) {
          onUploadSuccess();
        }

        setTimeout(() => {
          navigate("/personal-posts");
        }, 2000);
      } else {
        throw new Error("Đăng tải tài liệu thất bại!");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Document upload error:", error);

      // Sử dụng messageApi được truyền từ parent hoặc fallback về message global
      const showMessage = messageApi || message;

      if (error.response?.data?.message) {
        showMessage.error(`Lỗi: ${error.response.data.message}`);
      } else if (error.message) {
        showMessage.error(`Lỗi: ${error.message}`);
      } else {
        showMessage.error("Có lỗi xảy ra khi đăng tải tài liệu!");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onFinishFailed = () => {
    // console.log("Failed:");
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
    // Priority 1: Use provided thumbnail
    if (fileInfo?.thumbnail) {
      return fileInfo.thumbnail;
    }

    // Priority 2: Generate PDF thumbnail from original URL
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

    // Priority 3: For Word documents without thumbnail, show document icon
    if (fileInfo?.type === "WORD") {
      return "https://cdn-icons-png.flaticon.com/512/337/337946.png";
    }

    // Priority 4: Use original URL if available
    if (fileInfo?.url && typeof fileInfo.url === "string") {
      return fileInfo.url;
    }

    // Priority 5: Default fallback icon
    return "https://cdn-icons-png.flaticon.com/512/2425/2425541.png";
  };

  // Determine if submit button should be disabled
  const isSubmitDisabled = !fileInfo || isUploading || submitting;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="font-semibold text-base sm:text-base mb-6 text-[var(--primary-text-color)] text-center md:text-left">
        Nhập thông tin
        {isUploading && (
          <span className="ml-2 text-sm text-orange-500 font-normal">
            (Đang tải file...)
          </span>
        )}
      </div>
      <div className="bg-white rounded-lg">
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
          {/* Main form grid - responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1 - Image and privacy */}
            <div className="space-y-4 lg:col-span-1">
              <div className="mb-0">
                <img
                  src={getPreviewImage()}
                  alt="Document preview"
                  className={`border border-gray-200 rounded object-cover w-full ${
                    isUploading ? "opacity-50" : ""
                  }`}
                  style={{ maxHeight: "250px" }}
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
                label={
                  <span className="text-xs font-semibold">
                    Chế độ công khai
                  </span>
                }
                rules={[
                  { required: true, message: "Vui lòng chọn quyền riêng tư!" },
                ]}
              >
                <Select disabled={isUploading} className="text-left">
                  <Option value="PUBLIC">Công khai</Option>
                  <Option value="PRIVATE">Riêng tư</Option>
                </Select>
              </Form.Item>
            </div>

            {/* Column 2 - Main form fields */}
            <div className="space-y-4 md:col-span-1">
              <Form.Item
                style={{ marginBottom: 13.5 }}
                name="documentName"
                label={
                  <span className="text-xs font-semibold">Tên tài liệu</span>
                }
                rules={[
                  { required: true, message: "Vui lòng nhập tên tài liệu!" },
                ]}
              >
                <Input placeholder="Nhập tên tài liệu" disabled={isUploading} />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 13.5 }}
                name="subject"
                label={<span className="text-xs font-semibold">Môn học</span>}
                rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}
              >
                <div className="flex gap-2  text-left">
                  <Select
                    placeholder="Chọn hoặc nhập môn học"
                    disabled={isUploading || subjectsLoading}
                    showSearch
                    allowClear
                    notFoundContent={
                      subjectsLoading ? "Đang tải..." : "Không có dữ liệu"
                    }
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      String(option?.children || "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    style={{ flex: 1 }}
                    onChange={(value) => {
                      // console.log("Subject selected:", value);
                      form.setFieldsValue({ subject: value });
                    }}
                  >
                    {subjects.map((subject) => (
                      <Option key={subject._id} value={subject._id}>
                        {subject.name}
                      </Option>
                    ))}
                  </Select>
                  <Button
                    type="primary"
                    icon={<Plus size={16} />}
                    onClick={showAddSubjectModal}
                    disabled={isUploading}
                    title="Thêm môn học mới"
                  />
                </div>
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 13.5 }}
                name="organization"
                label={<span className="text-xs font-semibold">Tổ chức</span>}
                rules={[{ required: true, message: "Vui lòng chọn tổ chức!" }]}
              >
                <Select
                  placeholder="Tổ chức"
                  disabled={true} // Disable because it's auto-set from user context
                  className="text-left"
                >
                  {user?.organization &&
                    typeof user.organization === "object" && (
                      <Option value={user.organization._id}>
                        {user.organization.name}
                      </Option>
                    )}
                </Select>
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 13.5 }}
                name="documentType"
                className="text-left"
                label={
                  <span className="text-xs font-semibold">Loại tài liệu</span>
                }
                rules={[
                  { required: true, message: "Vui lòng chọn loại tài liệu!" },
                ]}
              >
                <Select
                  placeholder="Loại tài liệu"
                  disabled={isUploading}
                  dropdownStyle={{ textAlign: "left" }}
                >
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Form.Item
                  style={{ marginBottom: 13.5 }}
                  name="pageCount"
                  label={
                    <span className="text-xs font-semibold">Số trang</span>
                  }
                >
                  <InputNumber
                    min={1}
                    className="w-full"
                    placeholder="Số trang"
                    style={{ width: "100%" }}
                    disabled={isUploading}
                    onKeyDown={(e) => {
                      // Chỉ cho phép số, backspace, delete, arrow keys, tab
                      const allowedKeys = [
                        "Backspace",
                        "Delete",
                        "ArrowLeft",
                        "ArrowRight",
                        "ArrowUp",
                        "ArrowDown",
                        "Tab",
                        "Enter",
                      ];
                      if (
                        !/[0-9]/.test(e.key) &&
                        !allowedKeys.includes(e.key)
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                </Form.Item>

                <Form.Item
                  style={{ marginBottom: 13.5 }}
                  name="level"
                  label={
                    <span className="text-xs font-semibold">Trình độ</span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng chọn trình độ!" },
                  ]}
                >
                  <Select
                    placeholder="Chọn trình độ"
                    disabled={isUploading}
                    dropdownStyle={{ textAlign: "left" }}
                  >
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
            <div className="md:col-span-1">
              <Form.Item
                style={{ marginBottom: 5 }}
                name="summary"
                label={<span className="text-xs font-semibold">Tóm tắt</span>}
                rules={[{ required: true, message: "Vui lòng nhập tóm tắt!" }]}
              >
                <TextArea
                  placeholder="Nhập mô tả hoặc tóm tắt tài liệu vào đây"
                  rows={12}
                  style={{ resize: "none", borderColor: "#60a5fa" }}
                  disabled={isUploading}
                />
              </Form.Item>
            </div>
          </div>

          {/* Thông tin khác */}
          <div className="pt-6 border-t border-gray-200">
            <div className="font-semibold text-base mb-2 text-[var(--primary-text-color)] text-center md:text-left">
              Thông tin khác
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Form.Item
                    style={{ marginBottom: 5 }}
                    name="publisher"
                    label={
                      <span className="text-xs font-semibold">
                        Nhà xuất bản
                      </span>
                    }
                  >
                    <Input placeholder="Nhà xuất bản" disabled={isUploading} />
                  </Form.Item>

                  <Form.Item
                    style={{ marginBottom: 5 }}
                    name="publishYear"
                    label={
                      <span className="text-xs font-semibold">
                        Năm xuất bản
                      </span>
                    }
                  >
                    <Input placeholder="Năm xuất bản" disabled={isUploading} />
                  </Form.Item>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-left text-black mb-2">
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
                  <div className="flex justify-baseline items-baseline w-full">
                    <Button
                      type="dashed"
                      icon={<Plus size={16} />}
                      onClick={addAuthor}
                      className="w-12 h-10"
                      disabled={isUploading}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="keywords"
                  label={<span className="text-xs font-semibold">Từ khóa</span>}
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-8 pt-6 border-t border-gray-200 gap-4">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                onClick={() => form.resetFields()}
                disabled={isUploading || submitting}
                className="w-full sm:w-auto"
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                disabled={isSubmitDisabled}
                className="w-full sm:w-auto"
              >
                {submitting
                  ? "Đang đăng tải..."
                  : isUploading
                  ? "Đang tải file..."
                  : "Đăng tải"}
              </Button>
            </div>
            {isSubmitDisabled && !submitting && (
              <div className="text-xs text-gray-500 w-full sm:w-auto text-center sm:text-left">
                {!fileInfo
                  ? "Vui lòng tải lên file trước"
                  : isUploading
                  ? "Đang tải file lên..."
                  : ""}
              </div>
            )}
          </div>
        </Form>

        {/* Modal for adding new subject */}
        <Modal
          title="Thêm môn học mới"
          open={isModalVisible}
          onCancel={handleModalCancel}
          footer={null}
          width={600}
          className="max-w-[95vw] sm:max-w-[600px]"
        >
          <Form
            form={newSubjectForm}
            layout="vertical"
            onFinish={handleCreateSubject}
            className="mt-4"
          >
            <Form.Item
              name="name"
              label="Tên môn học"
              rules={[
                { required: true, message: "Vui lòng nhập tên môn học!" },
                { min: 2, message: "Tên môn học phải có ít nhất 2 ký tự!" },
              ]}
            >
              <Input placeholder="Nhập tên môn học" />
            </Form.Item>

            <Form.Item
              name="code"
              label="Mã môn học"
              rules={[
                { required: true, message: "Vui lòng nhập mã môn học!" },
                {
                  pattern: /^[A-Z0-9]+$/,
                  message: "Mã môn học chỉ được chứa chữ cái in hoa và số!",
                },
              ]}
            >
              <Input placeholder="Nhập mã môn học (VD: MATH101)" />
            </Form.Item>

            <Form.Item name="description" label="Mô tả (tùy chọn)">
              <TextArea
                placeholder="Nhập mô tả về môn học"
                rows={3}
                style={{ resize: "none" }}
              />
            </Form.Item>

            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
              <Button onClick={handleModalCancel} className="w-full sm:w-auto">
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full sm:w-auto"
              >
                Tạo môn học
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default InformationForm;
