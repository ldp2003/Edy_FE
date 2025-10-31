import type { RcFile } from "antd/es/upload/interface";
import { CloudinaryAPI } from "../api/API";

const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_CLOUD_URL;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  resource_type: string;
  bytes: number;
  width: number;
  height: number;
}

// Helper functions to extract public ID and resource type from Cloudinary URL
export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    if (!url) return null;

    // Tìm pattern: /(raw|image|video)/upload/[v123456789/]publicId.extension
    const match = url.match(/\/(raw|image|video)\/upload\/(?:v\d+\/)?(.+)$/);

    if (match && match[2]) {
      // Decode URL để chuyển từ %C4%90 về tiếng Việt
      const decodedPath = decodeURIComponent(match[2]);

      // Kiểm tra xem có phải file Word hoặc Excel không (.doc, .docx, .xls, .xlsx)
      const isWordFile = /\.(doc|docx)$/i.test(decodedPath);
      const isExcelFile = /\.(xls|xlsx)$/i.test(decodedPath);

      if (isWordFile || isExcelFile) {
        // Giữ nguyên extension cho file Word và Excel
        return decodedPath;
      } else {
        // Loại bỏ extension cho các file khác
        const lastDotIndex = decodedPath.lastIndexOf(".");
        if (lastDotIndex !== -1) {
          return decodedPath.substring(0, lastDotIndex);
        }
        return decodedPath;
      }
    }

    return null;
  } catch (error) {
    console.error("Error extracting publicId:", error);
    return null;
  }
};

export const extractResourceTypeFromUrl = (
  url: string
): "raw" | "image" | "video" => {
  try {
    // Tìm resource type từ URL pattern: /resource_type/
    const match = url.match(/\/(raw|image|video)\//);
    return match ? (match[1] as "raw" | "image" | "video") : "image"; // Mặc định là image nếu không tìm thấy
  } catch (error) {
    console.error("Error extracting resource type:", error);
    return "image";
  }
};

// Generate random public_id để tránh trùng tên file
export const generateRandomPublicId = (): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  return `upload_${timestamp}_${randomString}`;
};

export const uploadImageToCloudinary = async (
  file: RcFile
): Promise<CloudinaryUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  // Generate random public_id để tránh overwrite khi trùng tên file
  const publicId = generateRandomPublicId();
  formData.append("public_id", publicId);

  const response = await fetch(CLOUDINARY_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export interface CloudinaryDeleteResponse {
  message: string;
  data: {
    success: boolean;
    public_id: string;
    message: string;
  };
}

export interface CloudinaryFileInfoResponse {
  message: string;
  data: {
    public_id: string;
    format: string;
    version: number;
    resource_type: string;
    type: string;
    created_at: string;
    bytes: number;
    width: number;
    height: number;
    url: string;
    secure_url: string;
  };
}

export const CloudinaryService = {
  /**
   * Delete file from Cloudinary
   * @param fileUrl - URL of the file to delete
   * @param resourceType - Resource type override (optional, auto-detected from URL if not provided)
   * @returns Promise<CloudinaryDeleteResponse>
   */
  async deleteFile(
    fileUrl: string,
    resourceType?: "raw" | "image" | "video"
  ): Promise<CloudinaryDeleteResponse> {
    try {
      const response = await CloudinaryAPI.deleteFile({
        fileUrl,
        resourceType,
      });
      return response;
    } catch (error) {
      console.error("Error in CloudinaryService.deleteFile:", error);
      throw error;
    }
  },

  /**
   * Get file info from Cloudinary
   * @param fileUrl - URL of the file
   * @param resourceType - Resource type override (optional, auto-detected from URL if not provided)
   * @returns Promise<CloudinaryFileInfoResponse>
   */
  async getFileInfo(
    fileUrl: string,
    resourceType?: "raw" | "image" | "video"
  ): Promise<CloudinaryFileInfoResponse> {
    try {
      const response = await CloudinaryAPI.getFileInfo({
        fileUrl,
        resourceType,
      });
      return response;
    } catch (error) {
      console.error("Error in CloudinaryService.getFileInfo:", error);
      throw error;
    }
  },
};
