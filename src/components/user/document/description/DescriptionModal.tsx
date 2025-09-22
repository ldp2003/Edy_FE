import React, { useState } from "react";
import { Button } from "antd";
import { Eye } from "lucide-react";

const DescriptionModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="relative">
      {isVisible && (
        <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center w-full h-full z-10">
          <div className="bg-gradient-to-b from-[#2D6F95] to-[#4BBBFB] p-6 rounded-lg shadow-lg text-center">
            <p className="text-sm font-bold text-white mb-4">
              Dùng điểm để mở xem bản tóm tắt của tài liệu
            </p>
            <Button
              className=" hover:bg-[var(--primary-color)] text-sm font-bold text-[var(--primary-text-color)]"
              onClick={() => setIsVisible(false)}
              size="small"
            >
              <Eye size={15} />
              <span className="text-xs">Xem</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DescriptionModal;
