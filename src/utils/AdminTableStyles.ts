// Utility functions for common table styles used across admin components
export const getPermissionStyle = (permission: string) => {
  const permissionKey = permission.toLowerCase().replace(/_/g, "-");
  return {
    backgroundColor: `var(--permission-${permissionKey}-bg)`,
    color: `var(--permission-${permissionKey}-text)`,
    borderColor: `var(--permission-${permissionKey}-border)`,
    borderWidth: "1px",
    borderStyle: "solid",
  };
};

export const getStatusStyle = (status: string) => {
  const statusKey = status.toLowerCase();
  return {
    backgroundColor: `var(--status-${statusKey}-bg)`,
    color: `var(--status-${statusKey}-text)`,
    borderColor: `var(--status-${statusKey}-border)`,
    borderWidth: "1px",
    borderStyle: "solid",
  };
};

export const getDocumentTypeStyle = (docType: string) => {
  const typeKey = docType.toLowerCase().replace(/_/g, "-");
  return {
    backgroundColor: `var(--doc-type-${typeKey}-bg)`,
    color: `var(--doc-type-${typeKey}-text)`,
    borderColor: `var(--doc-type-${typeKey}-border)`,
    borderWidth: "1px",
    borderStyle: "solid",
  };
};

export const getFileTypeStyle = (fileType: string) => {
  const typeKey = fileType.toLowerCase();
  return {
    backgroundColor: `var(--file-type-${typeKey}-bg)`,
    color: `var(--file-type-${typeKey}-text)`,
    borderColor: `var(--file-type-${typeKey}-border)`,
    borderWidth: "1px",
    borderStyle: "solid",
  };
};

export const getLevelStyle = (level: string) => {
  const levelKey = level.toLowerCase();
  return {
    backgroundColor: `var(--level-${levelKey}-bg)`,
    color: `var(--level-${levelKey}-text)`,
    borderColor: `var(--level-${levelKey}-border)`,
    borderWidth: "1px",
    borderStyle: "solid",
  };
};

export const getWarningStyle = () => {
  return {
    backgroundColor: `var(--warning-bg)`,
    color: `var(--warning-text)`,
    borderColor: `var(--warning-border)`,
    borderWidth: "1px",
    borderStyle: "solid",
  };
};
