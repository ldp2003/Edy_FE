import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import { DocumentService } from "../../../utils/DocumentService";
import type { Document } from "../../../models/document";
import EditInformationForm from "../../../components/user/personalPosts/EditInformationForm";
import LoadingScreen from "../../../components/common/LoadingScreen";

const EditDocumentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch document data
  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) {
        messageApi.error("ID tài liệu không hợp lệ!");
        navigate("/personal-posts");
        return;
      }

      try {
        setLoading(true);
        const documentData = await DocumentService.getDocumentById(id);
        setDocument(documentData);
      } catch (error) {
        console.error("Error fetching document:", error);
        messageApi.error("Không thể tải thông tin tài liệu!");
        navigate("/personal-posts");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id, messageApi, navigate]);

  const handleEditSuccess = () => {
    setTimeout(() => {
      navigate("/personal-posts");
    }, 1500);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy tài liệu!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-8">
      {contextHolder}
      {/* Form Container */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 pb-8">
        <EditInformationForm
          document={document}
          onEditSuccess={handleEditSuccess}
          messageApi={messageApi}
        />
      </div>
    </div>
  );
};

export default EditDocumentPage;
