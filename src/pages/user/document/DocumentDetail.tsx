import React from "react";
import DocumentSide from "../../../components/user/document/documentDetail/DocumentSide";
import DocumentActions from "../../../components/user/document/documentDetail/DocumentActions";
import AuthorInfo from "../../../components/common/userInfo/AuthorInfo";

const DocumentDetail: React.FC = () => {
  return (
    <div className="p-4 text-left">
      <DocumentSide></DocumentSide>
      <div className="!ml-[20%] !mr-[5%]">
        <AuthorInfo></AuthorInfo>
        <DocumentActions />
      </div>
    </div>
  );
};

export default DocumentDetail;
