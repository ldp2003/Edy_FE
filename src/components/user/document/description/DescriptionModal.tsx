import React, { useState } from "react";
import { Button } from "antd";
import { Eye } from "lucide-react";

const DescriptionModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="relative">
      {isVisible && (
        <div className="absolute p-8 -top-55 bg-white/80 rounded-lg  items-center justify-center w-full">
          <div className="bg-gradient-to-b from-[#2D6F95] to-[#4BBBFB] p-6 rounded-lg shadow-lg text-center">
            <p className="text-xl font-bold text-white mb-4">
              Dùng điểm để mở xem bản tóm tắt của tài liệu
            </p>
            <Button
              className=" hover:bg-blue-700 font-bold"
              style={{ color: "var(--primary-text-color)", fontWeight: "bold" }}
              onClick={() => setIsVisible(false)}
            >
              <Eye />
              Xem
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DescriptionModal;
