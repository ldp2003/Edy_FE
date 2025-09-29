import React from "react";
import DocumentInfo from "./DocumentInfo";
import Description from "../description/Description";
import Comment from "../documentComment/Comment";
import RelatedDocument from "./RelatedDocument";
import type { Document } from "../../../../models/document";

interface DocumentSideProps {
  document: Document;
  isUser?: boolean;
}

const DocumentSide: React.FC<DocumentSideProps> = ({
  document,
  isUser = false,
}) => {
  return (
    <aside className="w-80 text-left bg-white border-r border-gray-200 h-screen overflow-y-auto relative flex-shrink-0">
      <div className="pl-8 p-6">
        <DocumentInfo document={document} />
        <Description document={document} isUser={isUser} />
        <div className="mt-14"></div>
        <Comment />
        <RelatedDocument />
      </div>
    </aside>
  );
};

export default DocumentSide;
