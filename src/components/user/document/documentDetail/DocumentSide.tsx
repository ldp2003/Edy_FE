import React from "react";
import DocumentInfo from "./DocumentInfo";
import Description from "../description/Description";
import Comment from "./Comment";
import RelatedDocument from "./RelatedDocument";

const DocumentSide: React.FC = () => {
  return (
    <div className="fixed left-15 border-l top-0 pt-[90px] bg-white z-10 pl-8 p-6 w-[20%] border-r border-gray-200 h-screen overflow-y-auto box-sizing:border-box">
      <DocumentInfo />
      <Description />
      <Comment />
      <RelatedDocument />
    </div>
  );
};

export default DocumentSide;
