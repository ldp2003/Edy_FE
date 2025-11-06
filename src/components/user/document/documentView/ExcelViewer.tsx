import React from "react";

interface ExcelViewerProps {
  url: string;
  zoom?: number;
}

const ExcelViewer: React.FC<ExcelViewerProps> = ({ url, zoom = 1 }) => {
  return (
    <div
      className="select-none pointer-events-auto w-full h-screen"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: "top left",
      }}
    >
      <iframe
        src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
          url
        )}`}
        width="100%"
        height="100%"
        style={{ border: "none" }}
        title="Excel Viewer"
      />
    </div>
  );
};

export default ExcelViewer;
