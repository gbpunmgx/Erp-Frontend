"use client";
import React from "react";

const JournalVoucherView = () => {
  const voucherData = {
    date: "2025-01-15",
    voucherNo: "JV-001",
    entries: [
      { accountCode: "1001", description: "Cash Account", reference: "REF-001", debit: "5000.00", credit: "" },
      { accountCode: "2001", description: "Accounts Payable", reference: "REF-002", debit: "", credit: "5000.00" },
      { accountCode: "", description: "", reference: "", debit: "", credit: "" },
      { accountCode: "", description: "", reference: "", debit: "", credit: "" },
      { accountCode: "", description: "", reference: "", debit: "", credit: "" },
    ],
    reason: "Payment received from customer for invoice #INV-2025-001",
    preparedBy: "John Doe",
    paymentBy: "Jane Smith",
    approvedBy: "Mike Johnson",
 };

  const filteredEntries = voucherData.entries.filter(entry =>
    entry.accountCode || entry.description || entry.reference || entry.debit || entry.credit,
  );

  const calculateTotals = () => {
    const totalDebit = filteredEntries.reduce((sum, entry) => sum + (parseFloat(entry.debit) || 0), 0);
    const totalCredit = filteredEntries.reduce((sum, entry) => sum + (parseFloat(entry.credit) || 0), 0);
    return { totalDebit, totalCredit };
  };

  const { totalDebit, totalCredit } = calculateTotals();

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white dark:bg-gray-800 dark:text-white">
      {/* Print styles */}
      <style jsx>{`
          @media print {
              body {
                  margin: 0;
              }

              .no-print {
                  display: none;
              }
          }
      `}</style>

      <div className="border-2 border-blue-400 dark:border-blue-600">
        {/* Header */}
        <div className="bg-gray-600 text-white text-center py-2 dark:bg-gray-700">
          <h1 className="text-xl font-bold tracking-wide">Journal Voucher</h1>
        </div>

        <div className="p-3">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <span className="font-medium text-sm">Date: </span>
              <span className="border-b border-gray-300 pb-1 px-2 ml-1 min-w-[120px] text-sm dark:border-gray-600">
                {voucherData.date}
              </span>
            </div>
            <div className="px-3 py-1">
              <span className="font-medium text-sm">Voucher No.</span>
              <div className="mt-1 text-center text-sm">{voucherData.voucherNo}</div>
            </div>
          </div>

          {/* Main Table */}
          <div className="border border-gray-600 mb-4 dark:border-gray-500">
            {/* Table Header */}
            <div className="bg-gray-600 text-white grid grid-cols-12 font-medium text-center text-xs dark:bg-gray-700">
              <div className="col-span-2 py-2 px-1 border-r border-white">Account Code</div>
              <div className="col-span-4 py-2 px-1 border-r border-white">Description</div>
              <div className="col-span-2 py-2 px-1 border-r border-white">Reference</div>
              <div className="col-span-2 py-2 px-1 border-r border-white">Debit</div>
              <div className="col-span-2 py-2 px-1">Credit</div>
            </div>

            {/* Table Body */}
            {filteredEntries.map((entry, index) => (
              <div key={index} className="grid grid-cols-12 border-b border-gray-400 min-h-[30px] text-xs dark:border-gray-500">
                <div className="col-span-2 p-2 border-r border-gray-400 flex items-center dark:border-gray-500">
                  {entry.accountCode}
                </div>
                <div className="col-span-4 p-2 border-r border-gray-400 flex items-center dark:border-gray-500">
                  {entry.description}
                </div>
                <div className="col-span-2 p-2 border-r border-gray-400 flex items-center dark:border-gray-500">
                  {entry.reference}
                </div>
                <div className="col-span-2 p-2 border-r border-gray-400 flex items-center justify-end dark:border-gray-500">
                  {entry.debit}
                </div>
                <div className="col-span-2 p-2 flex items-center justify-end dark:border-gray-500">
                  {entry.credit}
                </div>
              </div>
            ))}

            {/* Total Row */}
            <div className="bg-gray-100 grid grid-cols-12 font-bold border-t border-gray-600 text-sm dark:bg-gray-700 dark:border-gray-500">
              <div className="col-span-8 p-2 text-right">Total</div>
              <div className="col-span-2 p-2 border-l border-gray-600 text-right dark:border-gray-500">
                {totalDebit.toFixed(2)}
              </div>
              <div className="col-span-2 p-2 border-l border-gray-600 text-right dark:border-gray-500">
                {totalCredit.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="flex items-start mb-2">
            <span className="font-medium text-sm mr-1">Reason :</span>
          </div>
          <div className="border-b border-gray-400 pb-1 min-h-[40px] text-xs text-gray-700 leading-relaxed dark:text-gray-300 dark:border-gray-500">
            {voucherData.reason}
          </div>

          {/* Signature Section */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="border-b border-black mb-2 pb-2 min-h-[50px] flex items-end justify-center">
                {voucherData.preparedBy && (
                  <span className="text-gray-600 italic text-xs dark:text-gray-400">{voucherData.preparedBy}</span>
                )}
              </div>
              <div className="font-medium text-sm">Prepared By</div>
            </div>

            <div className="text-center">
              <div className="border-b border-black mb-2 pb-2 min-h-[50px] flex items-end justify-center">
                {voucherData.paymentBy && (
                  <span className="text-gray-600 italic text-xs dark:text-gray-400">{voucherData.paymentBy}</span>
                )}
              </div>
              <div className="font-medium text-sm">Payment By</div>
            </div>

            <div className="text-center">
              <div className="border-b border-black mb-2 pb-2 min-h-[50px] flex items-end justify-center">
                {voucherData.approvedBy && (
                  <span className="text-gray-600 italic text-xs dark:text-gray-400">{voucherData.approvedBy}</span>
                )}
              </div>
              <div className="font-medium text-sm">Approved By</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center no-print">
        <button
          onClick={() => window.print()}
          className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors font-medium text-sm"
        >
          Print Voucher
        </button>
      </div>
    </div>
  );
};

export default JournalVoucherView;
