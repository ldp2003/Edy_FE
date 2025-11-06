import React from "react";

interface PowerPointViewerProps {
  url: string;
  zoom?: number;
}

const PowerPointViewer: React.FC<PowerPointViewerProps> = ({
  url,
  zoom = 1,
}) => {
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
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(
          url
        )}&embedded=true`}
        width="100%"
        height="100%"
        style={{ border: "none" }}
        title="PowerPoint Viewer"
      />
    </div>
  );
};

export default PowerPointViewer;
