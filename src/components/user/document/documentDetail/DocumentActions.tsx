import { Button } from "antd";
import {
  ThumbsUp,
  ThumbsDown,
  Heart,
  Share2,
  Flag,
  Download,
} from "lucide-react";
const  DocumentActions: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <Button size="small">
          <Flag className="w-4 h-4 mr-2" />
          Báo cáo
        </Button>
        <Button size="small">
          <ThumbsUp className="w-4 h-4 mr-2" />0
        </Button>
        <Button size="small">
          <ThumbsDown className="w-4 h-4 mr-2" />0
        </Button>
        <Button size="small">
          <Heart className="w-4 h-4 mr-2" />
          Lưu
        </Button>
        <Button size="small">
          <Share2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Button className="bg-green-600 hover:bg-green-700">
          <Download className="w-4 h-4 mr-2" />
          Tải về / 6 UP
        </Button>
      </div>
    </div>
  );    
}
export default DocumentActions;
