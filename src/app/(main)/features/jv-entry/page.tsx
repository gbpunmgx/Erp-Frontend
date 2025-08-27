"use client";
import { useState } from "react";

type Entry = {
  accountCode: string;
  description: string;
  debit: number;
  credit: number;
};

export default function JournalPage() {
  const [entries, setEntries] = useState<Entry[]>([{ accountCode: "", description: "", debit: 0, credit: 0 }]);

  const accounts = ["1000 - Cash", "2000 - Bank", "3000 - Sales", "4000 - Purchases", "5000 - Expenses"];

  // Add Row
  const addRow = () => {
    setEntries([...entries, { accountCode: "", description: "", debit: 0, credit: 0 }]);
  };

  // Update Row
  const updateRow = (index: number, field: keyof Entry, value: string | number) => {
    const updated = [...entries];
    if (field === "debit" || field === "credit") {
      updated[index][field] = Number(value) || 0;
    } else {
      updated[index][field] = value as string;
    }
    setEntries(updated);
  };

  // Totals
  const totalDebit = entries.reduce((sum, r) => sum + r.debit, 0);
  const totalCredit = entries.reduce((sum, r) => sum + r.credit, 0);
  const difference = totalDebit - totalCredit;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Dashboard</span>
          <span>/</span>
          <span>Journal</span>
          <span>/</span>
          <span className="font-semibold text-gray-900">Create Manual Journal</span>
        </div>
        <button className="rounded-lg bg-yellow-500 px-4 py-2 text-white shadow hover:bg-yellow-600">Submit</button>
      </div>

      {/* Overview Section */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Overview</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-gray-600">Journal Code</label>
            <input type="text" className="w-full rounded-lg border px-3 py-2" value="123489022" readOnly />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">Journal Type</label>
            <input type="text" className="w-full rounded-lg border px-3 py-2" defaultValue="Something New" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">Posting Date</label>
            <input type="date" className="w-full rounded-lg border px-3 py-2" defaultValue="2025-01-10" />
          </div>
        </div>
      </div>

      {/* Accounting Entries */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Accounting Entries</h2>
        <table className="w-full overflow-hidden rounded-lg border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm text-gray-600">No</th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">Account Code</th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">Description</th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">Debit</th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">Credit</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">
                  <select
                    value={entry.accountCode}
                    onChange={(e) => updateRow(idx, "accountCode", e.target.value)}
                    className="w-full rounded border px-2 py-1"
                  >
                    <option value="">Select Account</option>
                    {accounts.map((acc) => (
                      <option key={acc} value={acc}>
                        {acc}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={entry.description}
                    onChange={(e) => updateRow(idx, "description", e.target.value)}
                    className="w-full rounded border px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={entry.debit || ""}
                    onChange={(e) => updateRow(idx, "debit", e.target.value)}
                    className="w-full rounded border px-2 py-1 text-right"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={entry.credit || ""}
                    onChange={(e) => updateRow(idx, "credit", e.target.value)}
                    className="w-full rounded border px-2 py-1 text-right"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add Row */}
        <button onClick={addRow} className="mt-3 text-sm font-medium text-blue-600">
          + Add Row
        </button>

        {/* Totals */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-gray-600">Total Debit</label>
            <input
              type="text"
              className="w-full rounded-lg border px-3 py-2"
              value={`$${totalDebit.toLocaleString()}`}
              readOnly
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">Total Credit</label>
            <input
              type="text"
              className="w-full rounded-lg border px-3 py-2"
              value={`$${totalCredit.toLocaleString()}`}
              readOnly
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">Difference (Dr - Cr)</label>
            <input
              type="text"
              className={`w-full rounded-lg border px-3 py-2 font-semibold ${
                difference === 0 ? "text-green-600" : "text-red-600"
              }`}
              value={`$${difference.toLocaleString()}`}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
