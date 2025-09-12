import React from "react";
import UploadDocument from "../../../components/user/upload/UploadDocument";

const UploadPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tải lên tài liệu</h1>
      <UploadDocument />
    </div>
  );
};

export default UploadPage;
