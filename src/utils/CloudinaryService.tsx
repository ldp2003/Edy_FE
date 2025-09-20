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
