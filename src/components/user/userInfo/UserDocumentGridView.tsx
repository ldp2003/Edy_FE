import React from "react";
import { Row, Col, Spin } from "antd";
import DocumentCard from "../document/documentCard/DocumentCard";
import type { Document } from "../../../models/document";

interface UserDocumentGridViewProps {
  documents: Document[];
  loading?: boolean;
}

const UserDocumentGridView: React.FC<UserDocumentGridViewProps> = ({
  documents,
  loading,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <Row gutter={[16, 16]} justify="start">
        {documents.map((doc) => (
          <Col
            key={doc._id}
            xs={24}
            sm={12}
            md={12}
            lg={8}
            xl={6}
            xxl={4}
            style={{ maxWidth: "20%", flex: "0 0 20%" }}
          >
            <DocumentCard
              document={doc}
              navigationPath={`/document-detail/${doc._id}`}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default UserDocumentGridView;
