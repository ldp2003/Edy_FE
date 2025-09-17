import React from "react";
import UploadDocument from "../../../components/user/upload/UploadDocument";
import InfomationForm from "../../../components/user/document/documentForm/InfomationForm";

const UploadPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-base text-left font-bold mb-4">Tải lên tài liệu</h1>
      <UploadDocument />
      <InfomationForm></InfomationForm>
    </div>
  );
};

export default UploadPage;
