import { useState, useEffect, useContext, useCallback } from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  message,
  Modal,
  Upload,
} from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import { Plus, Minus, Upload as UploadIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../../../contexts/UserContext";
import SubjectService from "../../../utils/SubjectService";
import { DocumentService } from "../../../utils/DocumentService";
import { uploadImageToCloudinary } from "../../../utils/CloudinaryService";
import type { Subject } from "../../../models/subject";
import type { Document } from "../../../models/document";
import type { UploadFile, RcFile } from "antd/es/upload";

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
}

interface EditInformationFormProps {
  document: Document;
  onEditSuccess?: () => void;
  messageApi?: MessageInstance;
}

const EditInformationForm = ({
  document,
  onEditSuccess,
  messageApi,
}: EditInformationFormProps) => {
  const [form] = Form.useForm();
  const [authors, setAuthors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newSubjectForm] = Form.useForm();
  const [coverImage, setCoverImage] = useState<string>(
    document.cover_page || ""
  );
  const [uploading, setUploading] = useState(false);
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

  // Ensure form is updated when both document and subjects are available
  useEffect(() => {
    if (document && subjects.length > 0 && !subjectsLoading) {
      const subjectId =
        typeof document.subject === "object"
          ? document.subject._id
          : document.subject;

      // Check if the subject exists in the loaded subjects
      const subjectExists = subjects.find((s) => s._id === subjectId);
      console.log("Subject exists in list:", subjectExists);

      if (subjectExists) {
        // Force update the subject field specifically
        form.setFieldValue("subject", subjectId);
        console.log("Force set subject field to:", subjectId);
      }
    }
  }, [document, subjects, subjectsLoading, form]);

  // Pre-fill form with existing document data
  useEffect(() => {
    if (document && subjects.length > 0) {
      console.log("Setting form values with document:", document);
      console.log("Available subjects:", subjects);

      const subjectId =
        typeof document.subject === "object"
          ? document.subject._id
          : document.subject;

      console.log("Document subject ID:", subjectId);

      const formValues: Partial<FormData> = {
        documentName: document.title,
        subject: subjectId,
        organization:
          typeof document.organization === "object"
            ? document.organization._id
            : document.organization,
        documentType: document.doc_type ? String(document.doc_type) : "OTHER",
        pageCount: document.page,
        level: document.level,
        keywords: document.keyword ? document.keyword.join(", ") : "",
        publisher: document.publisher,
        publishYear: document.published_year?.toString(),
        summary: document.description?.summary_by_user || "",
        public_mode: document.public_mode || "PUBLIC",
      };

      // Set authors
      const documentAuthors =
        document.author && document.author.length > 0 ? document.author : [""];
      setAuthors(documentAuthors);
      formValues.authors = documentAuthors;

      console.log("Setting form values:", formValues);
      form.setFieldsValue(formValues);
      setCoverImage(document.cover_page || "");
    }
  }, [document, form, subjects]); // Add subjects to dependencies

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

    try {
      await SubjectService.createSubject({
        ...values,
        organization: user.organization._id,
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

  // Handle cover image upload
  const handleCoverUpload = async (file: UploadFile) => {
    setUploading(true);
    try {
      const rcFile = {
        ...file.originFileObj,
        uid: file.uid || Date.now().toString(),
        lastModifiedDate: new Date(),
      } as RcFile;
      const uploadResult = await uploadImageToCloudinary(rcFile);
      const uploadedUrl = uploadResult.secure_url;
      setCoverImage(uploadedUrl);
      message.success("Tải ảnh bìa thành công!");
    } catch (error) {
      console.error("Error uploading cover image:", error);
      message.error("Không thể tải ảnh bìa!");
    } finally {
      setUploading(false);
    }
    return false; // Prevent default upload behavior
  };

  const onFinish = async (values: FormData) => {
    setSubmitting(true);

    try {
      // Prepare data for update
      const updateData = {
        title: values.documentName,
        doc_type: values.documentType,
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
        cover_page: coverImage,
      };

      console.log("Document update data:", updateData);

      // Call the actual update document API
      const response = await DocumentService.updateDocument(
        document._id,
        updateData
      );

      if (response) {
        const showMessage = messageApi || message;
        showMessage.success("🎉 Cập nhật tài liệu thành công!");

        if (onEditSuccess) {
          onEditSuccess();
        }
      }
    } catch (error: unknown) {
      console.error("Document update error:", error);

      const showMessage = messageApi || message;

      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as {
          response?: { data?: { message?: string } };
        };
        showMessage.error(
          `Lỗi: ${apiError.response?.data?.message || "Lỗi API"}`
        );
      } else if (error instanceof Error) {
        showMessage.error(`Lỗi: ${error.message}`);
      } else {
        showMessage.error("Có lỗi xảy ra khi cập nhật tài liệu!");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo);
    message.error("Vui lòng kiểm tra lại thông tin!");
  };

  const getPreviewImage = () => {
    // Use current cover image or generate from original document
    if (coverImage) {
      return coverImage;
    }

    // Generate PDF thumbnail from original URL if available
    if (document.file_type === "PDF" && document.url) {
      return document.url.replace(
        "/upload/",
        "/upload/c_thumb,w_300,h_400,f_jpg/"
      );
    }

    // For Word documents, show document icon
    if (document.file_type === "WORD") {
      return "https://cdn-icons-png.flaticon.com/512/337/337946.png";
    }

    // Use original URL if available
    if (document.url) {
      return document.url;
    }

    // Default fallback icon
    return "https://cdn-icons-png.flaticon.com/512/2425/2425541.png";
  };

  return (
    <div className="py-6 min-h-screen text-center md:text-left bg-white p-4 sm:p-6 border border-[var(--border-color)] rounded-lg">
      <div className="font-bold text-base mb-6 text-[var(--primary-text-color)]">
        Chỉnh sửa thông tin tài liệu
      </div>
      <div className="mx-auto bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{
            public_mode: document.public_mode || "PUBLIC",
            authors: authors,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1 - Image and privacy */}
            <div className="space-y-4 md:col-span-1">
              <div className="mb-0">
                <img
                  src={getPreviewImage()}
                  alt="Document preview"
                  className={`border border-gray-200 rounded object-cover w-full ${
                    uploading ? "opacity-50" : ""
                  }`}
                  style={{ maxHeight: "300px" }}
                />
                <div className="text-xs text-gray-500 mt-1">
                  Tài liệu hiện tại
                </div>

                {/* Upload new cover image */}
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={handleCoverUpload}
                  disabled={uploading}
                >
                  <Button
                    type="dashed"
                    className="w-full mt-2"
                    icon={<UploadIcon size={16} />}
                    loading={uploading}
                  >
                    {uploading ? "Đang tải..." : "Đổi ảnh bìa"}
                  </Button>
                </Upload>
              </div>

              <Form.Item
                style={{ marginBottom: 5 }}
                name="public_mode"
                label={<span className="text-xs">Chế độ công khai</span>}
                rules={[
                  { required: true, message: "Vui lòng chọn quyền riêng tư!" },
                ]}
              >
                <Select disabled={submitting}>
                  <Option value="PUBLIC">Công khai</Option>
                  <Option value="PRIVATE">Riêng tư</Option>
                  <Option value="PRIVATE_SHARED">Chia sẻ riêng tư</Option>
                  <Option value="SHARE_ORGANIZATION">Chia sẻ tổ chức</Option>
                </Select>
              </Form.Item>
            </div>

            {/* Column 2 - Main form fields */}
            <div className="space-y-4 md:col-span-1">
              <Form.Item
                style={{ marginBottom: 13.5 }}
                name="documentName"
                label={<span className="text-xs">Tên tài liệu</span>}
                rules={[
                  { required: true, message: "Vui lòng nhập tên tài liệu!" },
                ]}
              >
                <Input placeholder="Nhập tên tài liệu" disabled={submitting} />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 13.5 }}
                name="subject"
                label={<span className="text-xs">Môn học</span>}
                rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}
              >
                <div className="flex gap-2">
                  <Select
                    placeholder="Chọn hoặc nhập môn học"
                    disabled={submitting || subjectsLoading}
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
                      console.log("Subject selected:", value);
                      form.setFieldValue("subject", value);
                    }}
                    loading={subjectsLoading}
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
                    disabled={submitting}
                    title="Thêm môn học mới"
                  />
                </div>
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 13.5 }}
                name="organization"
                label={<span className="text-xs">Tổ chức</span>}
                rules={[{ required: true, message: "Vui lòng chọn tổ chức!" }]}
              >
                <Select placeholder="Tổ chức" disabled={true}>
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
                label={<span className="text-xs">Loại tài liệu</span>}
                rules={[
                  { required: true, message: "Vui lòng chọn loại tài liệu!" },
                ]}
              >
                <Select placeholder="Loại tài liệu" disabled={submitting}>
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
                  label={<span className="text-xs">Số trang</span>}
                >
                  <InputNumber
                    min={1}
                    className="w-full"
                    placeholder="Số trang"
                    style={{ width: "100%" }}
                    disabled={submitting}
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
                  <Select placeholder="Chọn trình độ" disabled={submitting}>
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
                label={<span className="text-xs">Tóm tắt</span>}
                rules={[{ required: true, message: "Vui lòng nhập tóm tắt!" }]}
              >
                <TextArea
                  placeholder="Nhập mô tả hoặc tóm tắt tài liệu vào đây"
                  rows={15}
                  style={{ resize: "none", borderColor: "#60a5fa" }}
                  disabled={submitting}
                />
              </Form.Item>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="font-semibold text-base mb-4 text-gray-800">
              Thông tin khác
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Form.Item
                    style={{ marginBottom: 5 }}
                    name="publisher"
                    label="Nhà xuất bản"
                  >
                    <Input placeholder="Nhà xuất bản" disabled={submitting} />
                  </Form.Item>

                  <Form.Item
                    style={{ marginBottom: 5 }}
                    name="publishYear"
                    label="Năm xuất bản"
                  >
                    <Input placeholder="Năm xuất bản" disabled={submitting} />
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
                        disabled={submitting}
                      />
                      {idx > 0 && (
                        <Button
                          type="text"
                          icon={<Minus size={16} />}
                          onClick={() => removeAuthor(idx)}
                          className="p-2"
                          disabled={submitting}
                        />
                      )}
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    icon={<Plus size={16} />}
                    onClick={addAuthor}
                    className="w-12 h-10"
                    disabled={submitting}
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
                    disabled={submitting}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-8 pt-6 border-t border-gray-200 gap-4">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                onClick={() => navigate("/personal-posts")}
                disabled={submitting}
                className="w-full sm:w-auto"
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                disabled={submitting}
                className="w-full sm:w-auto"
              >
                {submitting ? "Đang cập nhật..." : "Cập nhật tài liệu"}
              </Button>
            </div>
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

export default EditInformationForm;
