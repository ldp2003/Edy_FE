import { CloudinaryAPI } from "../api/API";
import type { RcFile } from "antd/es/upload/interface";

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

export const uploadImageToCloudinary = async (
  file: RcFile
): Promise<CloudinaryUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

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
