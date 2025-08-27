"use client";
import { useState } from "react";

type PurchaseItem = {
  product: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export default function PurchaseEntryPage() {
  const [items, setItems] = useState<PurchaseItem[]>([
    { product: "", description: "", quantity: 0, unitPrice: 0, total: 0 },
  ]);

  // Mock Products with default prices
  const products: Record<string, number> = {
    Laptop: 800,
    Monitor: 250,
    Keyboard: 40,
    Mouse: 25,
    Printer: 300,
  };

  // Supplier list
  const suppliers = ["ABC Traders", "XYZ Supplies", "Everest Distributors", "Global Tech Mart"];

  // Add Row
  const addRow = () => {
    setItems([...items, { product: "", description: "", quantity: 0, unitPrice: 0, total: 0 }]);
  };

  // Update Row (generic + type-safe)
  function updateRow<K extends keyof PurchaseItem>(index: number, field: K, value: PurchaseItem[K]) {
    const updated = [...items];
    updated[index][field] = value;

    // Auto update description & price if product changes
    if (field === "product") {
      const price = products[value as string] || 0;
      updated[index].unitPrice = price;
      if (!updated[index].description) {
        updated[index].description = `${value}`;
      }
    }

    // Auto recalc total if qty or price changes
    if (field === "quantity" || field === "unitPrice" || field === "product") {
      updated[index].total = updated[index].quantity * updated[index].unitPrice;
    }

    setItems(updated);
  }

  // Totals
  const subtotal = items.reduce((sum, r) => sum + r.total, 0);
  const vat = subtotal * 0.13; // 13% VAT
  const grandTotal = subtotal + vat;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Dashboard</span>
          <span>/</span>
          <span>Purchases</span>
          <span>/</span>
          <span className="font-semibold text-gray-900">New Purchase Entry</span>
        </div>
        <button className="rounded-lg bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700">
          Save Purchase
        </button>
      </div>

      {/* Supplier & Invoice Info */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Purchase Overview</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-gray-600">Supplier Name</label>
            <select className="w-full rounded-lg border px-3 py-2">
              <option value="">Select Supplier</option>
              {suppliers.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">Invoice Number</label>
            <input type="text" className="w-full rounded-lg border px-3 py-2" placeholder="INV-0001" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">Purchase Date</label>
            <input type="date" className="w-full rounded-lg border px-3 py-2" defaultValue="2025-08-27" />
          </div>
        </div>
      </div>

      {/* Purchase Items */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Purchase Items</h2>
        <table className="w-full overflow-hidden rounded-lg border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm text-gray-600">No</th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">Product</th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">Description</th>
              <th className="px-4 py-2 text-right text-sm text-gray-600">Quantity</th>
              <th className="px-4 py-2 text-right text-sm text-gray-600">Unit Price</th>
              <th className="px-4 py-2 text-right text-sm text-gray-600">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">
                  <select
                    value={item.product}
                    onChange={(e) => updateRow(idx, "product", e.target.value)}
                    className="w-full rounded border px-2 py-1"
                  >
                    <option value="">Select Product</option>
                    {Object.keys(products).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateRow(idx, "description", e.target.value)}
                    className="w-full rounded border px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.quantity || ""}
                    onChange={(e) => updateRow(idx, "quantity", Number(e.target.value))}
                    className="w-full rounded border px-2 py-1 text-right"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.unitPrice || ""}
                    onChange={(e) => updateRow(idx, "unitPrice", Number(e.target.value))}
                    className="w-full rounded border px-2 py-1 text-right"
                  />
                </td>
                <td className="px-4 py-2 text-right">{item.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add Row */}
        <button onClick={addRow} className="mt-3 text-sm font-medium text-blue-600">
          + Add Item
        </button>

        {/* Totals */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-gray-600">Subtotal</label>
            <input
              type="text"
              className="w-full rounded-lg border px-3 py-2"
              value={`$${subtotal.toLocaleString()}`}
              readOnly
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">VAT (13%)</label>
            <input
              type="text"
              className="w-full rounded-lg border px-3 py-2"
              value={`$${vat.toLocaleString()}`}
              readOnly
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">Grand Total</label>
            <input
              type="text"
              className="w-full rounded-lg border px-3 py-2 font-semibold text-green-600"
              value={`$${grandTotal.toLocaleString()}`}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
