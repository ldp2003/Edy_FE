import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DocumentAPI } from '../../../api/API';
import { LoadingOutlined, CheckCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined, SendOutlined } from '@ant-design/icons';
import { Modal, Input, Button } from 'antd';

const { TextArea } = Input;

const ShareAccess: React.FC = () => {
    const { linkId } = useParams<{ linkId: string }>();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'request_needed'>('loading');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [documentTitle, setDocumentTitle] = useState<string>('');
    const [requestSent, setRequestSent] = useState<boolean>(false);

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [requestContent, setRequestContent] = useState<string>('');
    const [sendingRequest, setSendingRequest] = useState<boolean>(false);

    useEffect(() => {
        if (!linkId) {
            setStatus('error');
            setErrorMessage('Link không hợp lệ');
            return;
        }

        const checkAccess = async () => {
            try {
                setStatus('loading');

                const response = await DocumentAPI.accessShareLink(linkId);

                if (response.required_access) {
                        setStatus('request_needed');
                        setErrorMessage('Bạn cần chủ tài liệu cấp quyền để được tiếp tục truy cập.');
                        return;
                    }
                if (response && response.data) {
                    const data = response.data;
                    if (data.access_granted) {
                        setStatus('success');
                        setDocumentTitle(data.documentTitle || 'tài liệu');

                        // Auto redirect after 2 seconds
                        setTimeout(() => {
                            navigate(data.redirect_url || `/document-detail/${data.documentId}`);
                        }, 2000);
                    } else {
                        navigate(data.redirect_url || `/document-detail/${data.documentId}`);
                    }
                }
                else {
                    setStatus('error');
                    setErrorMessage(response.data.message || 'Không có quyền truy cập tài liệu này');
                }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                setStatus('error');

                let errorMsg = 'Có lỗi xảy ra khi kiểm tra quyền truy cập';

                if (error.response) {
                    const serverMessage = error.response.data?.message || error.response.data?.error;

                    
                    if (serverMessage) {
                        errorMsg = serverMessage;
                    } else if (error.response.status === 403) {
                        errorMsg = 'Bạn không có quyền truy cập tài liệu này';
                    } else if (error.response.status === 404) {
                        errorMsg = 'Link chia sẻ không tồn tại hoặc đã hết hạn';
                    } else if (error.response.status === 429) {
                        errorMsg = 'Đã đạt giới hạn người dùng cho link này';
                    }
                } else if (error.request) {
                    errorMsg = 'Không thể kết nối đến server';
                }

                setErrorMessage(errorMsg);
            }
        };

        checkAccess();
    }, [linkId, navigate]);

    const handleGoHome = () => {
        navigate('/');
    };

    const handleRetry = () => {
        window.location.reload();
    };

    const handleOpenRequestModal = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setRequestContent('');
    };

    const handleSendAccessRequest = async () => {
        if (!requestContent.trim()) {
            return;
        }

        try {
            setSendingRequest(true);
            
            // TODO: Call API to send access request
            // await DocumentAPI.sendAccessRequest(linkId, requestContent);
            
            // Simulate API call for now
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setRequestSent(true);
            setModalVisible(false);
            setRequestContent('');
        } catch (error) {
            console.error('Error sending access request:', error);
            // Handle error if needed
        } finally {
            setSendingRequest(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                {status === 'loading' && (
                    <>
                        <div className="mb-6">
                            <LoadingOutlined
                                style={{ fontSize: '48px', color: '#1890ff' }}
                                spin
                            />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Đang kiểm tra quyền truy cập...
                        </h2>
                        <p className="text-gray-600">
                            Vui lòng đợi trong giây lát
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="mb-6">
                            <CheckCircleOutlined
                                style={{ fontSize: '48px', color: '#52c41a' }}
                            />
                        </div>
                        <h2 className="text-xl font-semibold text-green-700 mb-2">
                            Truy cập thành công!
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Bạn đã được cấp quyền truy cập tài liệu: <br />
                            <span className="font-medium text-gray-900">{documentTitle}</span>
                        </p>
                        <p className="text-sm text-blue-600">
                            Đang chuyển hướng...
                        </p>
                    </>
                )}

                {status === 'request_needed' && (
                    <>
                        <div className="mb-6">
                            <ClockCircleOutlined
                                style={{ fontSize: '48px', color: '#faad14' }}
                            />
                        </div>
                        <h2 className="text-xl font-semibold text-orange-700 mb-2">
                            Cần phê duyệt truy cập
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {errorMessage}
                        </p>
                        
                        {!requestSent ? (
                            <div className="flex flex-col gap-3 justify-center">
                                <button
                                    onClick={handleOpenRequestModal}
                                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                                >
                                    Gửi yêu cầu truy cập
                                </button>
                                <button
                                    onClick={handleGoHome}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Về trang chủ
                                </button>
                            </div>
                        ) : (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                                <span className="text-green-700 font-medium">
                                    Đã gửi yêu cầu truy cập!
                                </span>
                                <p className="text-green-600 text-sm mt-2">
                                    Chủ sở hữu tài liệu sẽ xem xét và phê duyệt yêu cầu của bạn.
                                </p>
                                <button
                                    onClick={handleGoHome}
                                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Về trang chủ
                                </button>
                            </div>
                        )}
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="mb-6">
                            <ExclamationCircleOutlined
                                style={{ fontSize: '48px', color: '#ff4d4f' }}
                            />
                        </div>
                        <h2 className="text-xl font-semibold text-red-700 mb-2">
                            Không thể truy cập
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {errorMessage}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={handleRetry}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Thử lại
                            </button>
                            <button
                                onClick={handleGoHome}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Về trang chủ
                            </button>
                        </div>
                    </>
                )}
            </div>
            {/* Access Request Modal */}
            <Modal
                title={
                    <div className="flex items-center space-x-2">
                        <SendOutlined className="text-orange-600" />
                        <span>Gửi yêu cầu truy cập</span>
                    </div>
                }
                open={modalVisible}
                onCancel={handleCloseModal}
                footer={null}
                width={500}
            >
                <div className="py-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tin nhắn yêu cầu truy cập:
                        </label>
                        <TextArea
                            placeholder="Nhập lời nhắn của bạn đến người sỡ hữu..."
                            value={requestContent}
                            onChange={(e) => setRequestContent(e.target.value)}
                            rows={4}
                            maxLength={500}
                            showCount
                            className="w-full"
                        />
                    </div>

                    <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                        <div className="flex items-start space-x-2">
                            <div className="text-blue-600">ℹ️</div>
                            <div>
                                <p className="font-medium mb-1">Lưu ý:</p>
                                <p>Chủ sở hữu sẽ biết bạn là ai và có thể xem thông tin hồ sơ của bạn khi xem xét yêu cầu này.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button
                            onClick={handleCloseModal}
                            disabled={sendingRequest}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={handleSendAccessRequest}
                            loading={sendingRequest}
                            className="bg-orange-600 hover:bg-orange-700 border-orange-600"
                        >
                            {sendingRequest ? 'Đang gửi...' : 'Gửi yêu cầu'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ShareAccess;