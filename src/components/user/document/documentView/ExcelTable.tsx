import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

interface ExcelTableProps {
  url: string;
  isUser?: boolean; // True if document belongs to current user
}

interface SheetData {
  name: string;
  data: (string | number | null)[][];
}

const ExcelTable: React.FC<ExcelTableProps> = ({
  url,
  isUser = false, // eslint-disable-line @typescript-eslint/no-unused-vars
}) => {
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeSheet, setActiveSheet] = useState(0);

  useEffect(() => {
    const fetchExcel = async () => {
      try {
        const res = await fetch(url);
        const arrayBuffer = await res.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const result = workbook.SheetNames.map((name) => ({
          name,
          data: XLSX.utils.sheet_to_json(workbook.Sheets[name], {
            header: 1,
          }) as (string | number | null)[][],
        }));
        setSheets(result);
      } catch {
        setError("Không thể đọc file Excel");
      }
    };
    fetchExcel();
  }, [url]);

  if (error) return <div>{error}</div>;
  if (!sheets.length) return <div>Đang tải dữ liệu Excel...</div>;

  return (
    <div
      className="select-none pointer-events-auto"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* Sheet Tabs */}
      <div className="flex mb-3">
        {sheets.map((sheet, idx) => (
          <div
            key={sheet.name}
            onClick={() => setActiveSheet(idx)}
            className={`px-5 py-2 cursor-pointer rounded-t-lg mr-1 ${
              idx === activeSheet
                ? "bg-blue-100 border-2 border-blue-600 border-b-0 font-semibold"
                : "bg-gray-100 border border-gray-300 font-normal"
            }`}
          >
            {sheet.name}
          </div>
        ))}
      </div>
      {/* Active Sheet Table */}
      <div>
        <table className="border-collapse w-full bg-white text-sm font-sans">
          <tbody>
            {sheets[activeSheet].data.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) =>
                  i === 0 ? (
                    <th
                      key={j}
                      className="bg-gray-100 font-semibold border border-gray-300"
                    >
                      {cell}
                    </th>
                  ) : (
                    <td key={j} className="border border-gray-300">
                      {cell}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExcelTable;
