/**
 * Interface cho dữ liệu phản ứng của tài liệu
 */
export interface ReactionData {
  likes: number;
  dislikes: number;
  userReaction: "LIKE" | "DISLIKE" | null;
}

/**
 * Tính tỷ lệ đánh giá dựa trên số lượt thích và không thích
 * @param likes - Số lượt thích
 * @param dislikes - Số lượt không thích
 * @returns Tỷ lệ phần trăm từ 0-100%
 */
export const calculateRatingPercentage = (
  likes: number,
  dislikes: number
): number => {
  const totalReactions = likes + dislikes;

  // Nếu không có phản ứng nào, trả về 0%
  if (totalReactions === 0) {
    return 0;
  }

  // Tính tỷ lệ thích / tổng phản ứng
  const percentage = (likes / totalReactions) * 100;

  // Làm tròn đến 1 chữ số thập phân
  return Math.round(percentage * 10) / 10;
};

/**
 * Định dạng tỷ lệ đánh giá thành chuỗi hiển thị
 * @param percentage - Tỷ lệ phần trăm
 * @returns Chuỗi định dạng như "85.5%" hoặc "0%"
 */
export const formatRatingPercentage = (percentage: number): string => {
  if (percentage === 0) {
    return "0%";
  }

  // Nếu là số nguyên, không hiển thị phần thập phân
  if (percentage % 1 === 0) {
    return `${percentage}%`;
  }

  return `${percentage}%`;
};

/**
 * Tính toán tỷ lệ đánh giá từ số lượt like và dislike
 * @param likes - Số lượt like
 * @param dislikes - Số lượt dislike
 * @returns Object chứa ratingPercentage và formattedRating
 */
export const calculateDocumentRating = (
  likes: number = 0,
  dislikes: number = 0
): { ratingPercentage: number; formattedRating: string } => {
  const ratingPercentage = calculateRatingPercentage(likes, dislikes);
  const formattedRating = formatRatingPercentage(ratingPercentage);

  return { ratingPercentage, formattedRating };
};

/**
 * Tính toán tỷ lệ đánh giá cho nhiều tài liệu từ dữ liệu like/dislike trực tiếp
 * @param documents - Mảng các document có chứa _id, like và dislike
 * @returns Map với key là documentId và value là rating data
 * @deprecated Sử dụng calculateDocumentRating thay thế
 */
export const calculateMultipleDocumentRatings = (
  documents: Array<{ _id: string; like?: number; dislike?: number }>
): Map<string, { ratingPercentage: number; formattedRating: string }> => {
  const ratingMap = new Map();

  documents.forEach((document) => {
    // Đảm bảo _id tồn tại
    if (!document._id) {
      console.warn("Document missing _id:", document);
      return;
    }

    const likes = document.like || 0;
    const dislikes = document.dislike || 0;

    const rating = calculateDocumentRating(likes, dislikes);
    ratingMap.set(document._id, rating);
  });

  return ratingMap;
};

/**
 * Định nghĩa các mức đánh giá
 */
export const RatingLevel = {
  EXCELLENT: "EXCELLENT" as const, // 90-100%
  GOOD: "GOOD" as const, // 70-89%
  AVERAGE: "AVERAGE" as const, // 50-69%
  POOR: "POOR" as const, // 30-49%
  VERY_POOR: "VERY_POOR" as const, // 0-29%
} as const;

export type RatingLevel = (typeof RatingLevel)[keyof typeof RatingLevel];

/**
 * Xác định mức đánh giá dựa trên tỷ lệ phần trăm
 * @param percentage - Tỷ lệ phần trăm
 * @returns Mức đánh giá
 */
export const getRatingLevel = (percentage: number): RatingLevel => {
  if (percentage >= 90) return RatingLevel.EXCELLENT;
  if (percentage >= 70) return RatingLevel.GOOD;
  if (percentage >= 50) return RatingLevel.AVERAGE;
  if (percentage >= 30) return RatingLevel.POOR;
  return RatingLevel.VERY_POOR;
};

/**
 * Lấy nhãn hiển thị cho mức đánh giá
 * @param level - Mức đánh giá
 * @returns Nhãn tiếng Việt
 */
export const getRatingLevelLabel = (level: RatingLevel): string => {
  const labels = {
    [RatingLevel.EXCELLENT]: "Xuất sắc",
    [RatingLevel.GOOD]: "Tốt",
    [RatingLevel.AVERAGE]: "Trung bình",
    [RatingLevel.POOR]: "Kém",
    [RatingLevel.VERY_POOR]: "Rất kém",
  };

  return labels[level];
};

/**
 * Lấy màu sắc cho mức đánh giá (dùng cho UI)
 * @param level - Mức đánh giá
 * @returns Class CSS màu sắc
 */
export const getRatingLevelColor = (level: RatingLevel): string => {
  const colors = {
    [RatingLevel.EXCELLENT]: "text-green-600",
    [RatingLevel.GOOD]: "text-blue-600",
    [RatingLevel.AVERAGE]: "text-yellow-600",
    [RatingLevel.POOR]: "text-orange-600",
    [RatingLevel.VERY_POOR]: "text-red-600",
  };

  return colors[level];
};
