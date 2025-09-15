import { Avatar, Button } from "antd";
import { UserPlus } from "lucide-react";

const AuthorInfo: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <Avatar className="w-12 h-12">
          <img
            src="/placeholder.svg?height=48&width=48"
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </Avatar>
        <div>
          <h3 className="font-semibold text-lg">Đại Phát</h3>
          <p className="text-sm text-gray-600">
            Trường đại học Công nghiệp Thành phố Hồ Chí Minh
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="text-center">
          <div className="font-semibold">0</div>
          <div className="text-xs text-gray-500">Người theo dõi</div>
        </div>
        <div className="text-center">
          <div className="font-semibold">0</div>
          <div className="text-xs text-gray-500">Đang theo dõi</div>
        </div>
        <div className="text-center">
          <div className="font-semibold">0</div>
          <div className="text-xs text-gray-500">Bài đăng</div>
        </div>
        <Button type="primary" size="small">
          <UserPlus className="w-4 h-4 mr-2" />
          Theo dõi
        </Button>
      </div>
    </div>
  );
};
export default AuthorInfo;
