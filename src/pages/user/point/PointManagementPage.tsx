import React, { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import PointManagement from "../../../components/common/point/PointManagement";
import PointMechanism from "../../../components/common/point/PointMechanism";
import { UserContext } from "../../../contexts/UserContext";
import { PointTransactionService } from "../../../utils/PointTransaction";

const PointManagementPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const showHistory = searchParams.get("showHistory") === "true";
  const { user } = useContext(UserContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showHistory && user?._id) {
      const fetchTransactions = async () => {
        setLoading(true);
        try {
          const response = await PointTransactionService.getTransactionHistory(
            user._id,
            { page: 1, limit: 50 }
          );
          const apiData = response.data;
          const data = apiData?.data || apiData;
          let transactionsData = [];
          if (Array.isArray(data)) {
            transactionsData = data;
          } else if (data?.transactions && Array.isArray(data.transactions)) {
            transactionsData = data.transactions;
          } else {
            transactionsData = [];
          }
          setTransactions(transactionsData);
        } catch (error) {
          console.error("Error fetching point transactions:", error);
          setTransactions([]);
        } finally {
          setLoading(false);
        }
      };
      fetchTransactions();
    }
  }, [showHistory, user]);

  if (showHistory) {
    return (
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold text-[var(--primary-text-color)] mb-4 md:mb-6 text-center md:text-left">
            Quản lý điểm
          </h1>
          <PointManagement transactions={transactions} loading={loading} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold text-[var(--primary-text-color)] mb-4 md:mb-6 text-center md:text-left">
          Cơ chế tích tiêu điểm
        </h1>
        <PointMechanism />
      </div>
    </div>
  );
};

export default PointManagementPage;
