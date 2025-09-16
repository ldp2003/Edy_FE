import { Avatar, Button } from "antd";
import { School, UserPlus } from "lucide-react";

const AuthorInfo: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 rounded-xl mb-6 shadow">
      <div className="flex items-center flex-row gap-4">
        <Avatar size={80} className="bg-gray-200">
          <img
            src="/placeholder.svg?height=100&width=100"
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </Avatar>
        <div className="flex flex-col gap-3">
          <h3
            className="font-semibold text-lg"
            style={{ color: "var(--primary-color)" }}
          >
            Đại Phát
          </h3>
          <div className="flex flex-row gap-3">
            <School />
            <p className="text-base font-semibold">
              Trường đại học Công nghiệp Thành phố Hồ Chí Minh
            </p>
          </div>
        </div>
      </div>

      <div
        className="flex flex-col items-center space-y-6"
        style={{ color: "var(--primary-text-color)" }}
      >
        <div className="flex flex-row space-x-6">
          <div className="text-center">
            <div className="font-semibold">0</div>
            <div className="text-sm">Người theo dõi</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">0</div>
            <div className="text-sm">Đang theo dõi</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">0</div>
            <div className="text-sm">Bài đăng</div>
          </div>
        </div>

        <Button
          type="primary"
          size="middle"
          style={{
            backgroundColor: "var(--field-background-color",
            borderColor: "#665e4c",
            color: "#000000",
            width: "100%",
            borderRadius: "20px",
            fontWeight: "500",
            height: "36px",
            borderWidth: "0.5px",
          }}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Theo dõi
        </Button>
      </div>
    </div>
  );
};
export default AuthorInfo;
