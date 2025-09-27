import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Spin, message } from "antd";
import { CheckCircle, XCircle } from "lucide-react";
import { DocumentAPI } from "../../../api/API";

const DirectDownload: React.FC = () => {
    const { linkId } = useParams<{ linkId: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const hasDownloaded = useRef(false); // Prevent double download

    useEffect(() => {
        if (!linkId) {
            setError("Link không hợp lệ");
            setLoading(false);
            return;
        }

        // Prevent double download
        if (hasDownloaded.current) {
            return;
        }

        hasDownloaded.current = true;
        handleDownload();
    }, [linkId]);

    const handleDownload = async () => {
        if (!linkId) return;

        try {
            setLoading(true);
            setError(null);

            console.log("Downloading file with linkId:", linkId);

            const response = await DocumentAPI.downloadFile(linkId);

            const blob = new Blob([response.data], {
                type: response.headers['content-type'] || 'application/pdf'
            });

            // Extract filename from custom headers (priority order)
            let filename = 'document.pdf';

            // 1. Try X-Filename first (full filename with extension)
            if (response.headers['x-filename']) {
                filename = decodeURIComponent(response.headers['x-filename']);
                console.log("Using X-Filename:", filename);
            }
            // 3. Fallback to Content-Disposition
            else {
                const contentDisposition = response.headers['content-disposition'];
                if (contentDisposition) {
                    console.log("Raw Content-Disposition:", contentDisposition);

                    // Try parsing filename*=UTF-8'' format first (RFC 6266)
                    const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;\s]+)/i);
                    if (utf8Match && utf8Match[1]) {
                        filename = decodeURIComponent(utf8Match[1]);
                        console.log("Extracted UTF-8 filename:", filename);
                    } else {
                        // Fallback to regular filename
                        const regularMatch = contentDisposition.match(/filename=["']?([^;"'\s]+)["']?/i);
                        if (regularMatch && regularMatch[1] && regularMatch[1] !== 'download') {
                            filename = regularMatch[1];
                            console.log("Extracted regular filename:", filename);
                        }
                    }
                } else {
                    console.log("No filename headers found, using fallback");
                    filename = `document_${Date.now()}.pdf`;
                }
            }

            console.log("Final filename:", filename);

            // Tạo download link và click
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            setSuccess(true);
            message.success("Tải xuống thành công!");

            setTimeout(() => {
                window.close();
                // If window.close() doesn't work (some browsers block it), redirect to home
                if (!window.closed) {
                    window.location.href = '/';
                }
            }, 5000);

        } catch (error: any) {
            console.error("Error downloading file:", error);

            let errorMsg = "Có lỗi xảy ra khi tải file!";

            if (error.response?.status === 403) {
                errorMsg = "Link đã hết hạn hoặc không hợp lệ!";
            } else if (error.response?.status === 401) {
                errorMsg = "Bạn cần đăng nhập để tải file!";
            } else if (error.response?.status === 404) {
                errorMsg = "Không tìm thấy file hoặc link đã hết hạn!";
            } else if (error.response?.status === 400 && error.response?.data?.message) {
                errorMsg = error.response.data.message;
            } else if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            } else if (error.message) {
                errorMsg = `Lỗi kết nối: ${error.message}`;
            }

            console.log("Final error message:", errorMsg);

            setError(errorMsg);
            message.error(errorMsg);

            setTimeout(() => {
                window.close();
                if (!window.closed) {
                    window.location.href = '/';
                }
            }, 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                <div className="text-center">
                    {loading && (
                        <>
                            <Spin size="large" className="mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Đang khởi tạo tải xuống...
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Vui lòng chờ trong giây lát
                            </p>
                        </>
                    )}

                    {error && (
                        <>
                            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                                <XCircle size={32} className="text-red-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Lỗi tải xuống
                            </h2>
                            <p className="text-red-600 mb-4 text-sm">
                                {error}
                            </p>
                            <p className="text-gray-500 text-xs">
                                Tab sẽ tự động đóng sau 5 giây...
                            </p>
                        </>
                    )}

                    {success && (
                        <>
                            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle size={32} className="text-green-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Đang tải xuống!
                            </h2>
                            <p className="text-gray-600 text-sm mb-4">
                                File đang được tải về máy của bạn. Kiểm tra thư mục Downloads.
                            </p>
                            <p className="text-gray-500 text-xs">
                                Tab sẽ tự động đóng sau 5 giây...
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DirectDownload;