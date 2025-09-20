// Export all translation utilities
export * from "./documentEnums";
export * from "./translationUtils";

// Main translation function for easy usage
export const translate = {
  status: (status: string) =>
    import("./translationUtils").then((m) => m.getStatusText(status)),
  publicMode: (mode: string) =>
    import("./translationUtils").then((m) => m.getPublicModeText(mode)),
  level: (level: string) =>
    import("./translationUtils").then((m) => m.getLevelText(level)),
  fileType: (type: string) =>
    import("./translationUtils").then((m) => m.getFileTypeText(type)),
  documentType: (type: string) =>
    import("./translationUtils").then((m) => m.getDocumentTypeText(type)),
};
