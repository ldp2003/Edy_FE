import React from "react";
import DocumentSide from "../../../components/user/document/documentDetail/DocumentSide";
import DocumentActions from "../../../components/user/document/documentDetail/DocumentActions";
import AuthorInfo from "../../../components/common/userInfo/AuthorInfo";
import DocumentViewer from "../../../components/user/document/documentView/DocumentViewer";

const DocumentDetail: React.FC = () => {
  const pdfUrl =
    "https://res.cloudinary.com/dyd5381vx/raw/upload/v1758014673/conversations/conv267250408133710/files/B%C3%A1o_c%C3%A1o_Sophy_kqzo8n.docx";
  const typeFile = "word"; // Hoặc 'pdf' tùy thuộc vào loại file bạn muốn hiển thị

  return (
    <div className="p-4 text-left">
      <DocumentSide></DocumentSide>
      <div className="!ml-[20%] ">
        <AuthorInfo></AuthorInfo>
        <DocumentActions />
        <DocumentViewer url={pdfUrl} type={typeFile} />
      </div>
    </div>
  );
};

export default DocumentDetail;
