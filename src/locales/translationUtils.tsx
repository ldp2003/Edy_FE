import { Tag } from "antd";
import {
  statusTranslations,
  publicModeTranslations,
  levelTranslations,
  fileTypeTranslations,
  documentTypeTranslations,
  statusColors,
  publicModeColors,
  levelColors,
  fileTypeColors,
  documentTypeColors,
} from "./documentEnums";

// Utility functions to get translated text
export const getStatusText = (status: string) => {
  return (
    statusTranslations[status as keyof typeof statusTranslations] || status
  );
};

export const getPublicModeText = (mode: string) => {
  return (
    publicModeTranslations[mode as keyof typeof publicModeTranslations] || mode
  );
};

export const getLevelText = (level: string) => {
  return levelTranslations[level as keyof typeof levelTranslations] || level;
};

export const getFileTypeText = (fileType: string) => {
  return (
    fileTypeTranslations[fileType as keyof typeof fileTypeTranslations] ||
    fileType
  );
};

export const getDocumentTypeText = (docType: string) => {
  return (
    documentTypeTranslations[
      docType as keyof typeof documentTypeTranslations
    ] || docType
  );
};

// Utility functions to create colored tags
export const createStatusTag = (status: string) => {
  const text = getStatusText(status);
  const color = statusColors[status as keyof typeof statusColors] || "#8c8c8c";

  return (
    <Tag color={color} className="font-medium">
      {text}
    </Tag>
  );
};

export const createPublicModeTag = (mode: string) => {
  const text = getPublicModeText(mode);
  const color =
    publicModeColors[mode as keyof typeof publicModeColors] || "#8c8c8c";

  return (
    <Tag color={color} className="font-medium">
      {text}
    </Tag>
  );
};

export const createLevelTag = (level: string) => {
  const text = getLevelText(level);
  const color = levelColors[level as keyof typeof levelColors] || "#8c8c8c";

  return (
    <Tag color={color} className="font-medium">
      {text}
    </Tag>
  );
};

export const createFileTypeTag = (fileType: string) => {
  const text = getFileTypeText(fileType);
  const color =
    fileTypeColors[fileType as keyof typeof fileTypeColors] || "#8c8c8c";

  return (
    <Tag color={color} className="font-medium">
      {text}
    </Tag>
  );
};

export const createDocumentTypeTag = (docType: string) => {
  const text = getDocumentTypeText(docType);
  const color =
    documentTypeColors[docType as keyof typeof documentTypeColors] || "#8c8c8c";

  return (
    <Tag color={color} className="font-medium">
      {text}
    </Tag>
  );
};

// Utility function to get rating with color
export const createRatingDisplay = (rating: string | number) => {
  const ratingValue =
    typeof rating === "string" ? parseFloat(rating.replace("%", "")) : rating;

  let color = "#8c8c8c"; // Default gray
  if (ratingValue >= 80) color = "#52c41a"; // Green
  else if (ratingValue >= 60) color = "#faad14"; // Gold
  else if (ratingValue >= 40) color = "#fa8c16"; // Orange
  else if (ratingValue >= 20) color = "#ff7a45"; // Orange-red
  else color = "#ff4d4f"; // Red

  return (
    <span style={{ color, fontWeight: "600" }}>
      {typeof rating === "string" ? rating : `${rating}%`}
    </span>
  );
};
