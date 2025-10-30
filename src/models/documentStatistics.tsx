export interface DocumentStatistics {
  stats: {
    totalDocuments: number;
    totalViews: number;
    totalDownloads: number;
  };
  documentTypes: Record<string, number>;
  topDocuments: TopDocument[];
  approvedDocuments: ApprovedDocument[];
  monthlyData: MonthlyData[];
  lastUpdated: string;
}

export interface TopDocument {
  document: string;
  _id?: string;
  id?: string;
  title: string;
  views: number;
  downloads: number;
  rating: string;
}

export interface ApprovedDocument {
  document: string;
  _id?: string;
  id?: string;
  title: string;
  author: string;
  subject: string;
  uploadDate: string;
  approvedDate: string;
  approvedBy: string;
  status: string;
}

export interface MonthlyData {
  day: string;
  views: number;
  downloads: number;
}
