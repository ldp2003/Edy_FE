import React from "react";
import DocumentInfo from "./DocumentInfo";
import Description from "../description/Description";
import Comment from "./Comment";
import RelatedDocument from "./RelatedDocument";

const DocumentSide: React.FC = () => {
  return (
    <aside className="overflow-hidden fixed left-15 border-l top-[80px] bg-white z-10 pl-8 p-6 w-[20%] border-r border-gray-200 min-h-screen">
      <DocumentInfo />
      <Description />
      <Comment />
      <RelatedDocument />
    </aside>
  );
};

export default DocumentSide;
