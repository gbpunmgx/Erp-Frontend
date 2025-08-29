"use client";
import { useState } from "react";

type SalesItem = {
  product: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountType: "%" | "amt";
  discountValue: number;
  total: number;
};

export default function SalesEntryPage() {
  const [items, setItems] = useState<SalesItem[]>([
    {
      product: "",
      description: "",
      quantity: 0,
      unit: "pcs",
      unitPrice: 0,
      discountType: "%",
      discountValue: 0,
      total: 0,
    },
  ]);

  const [discount, setDiscount] = useState<number>(0);

  // Mock Products with selling prices
  const products: Record<string, number> = {
    Laptop: 1000,
    Monitor: 350,
    Keyboard: 60,
    Mouse: 35,
    Printer: 450,
  };

  // Units
  const units = ["pcs", "box", "kg", "ltr"];

  // Customers
  const customers = ["Tech Solutions Pvt Ltd", "Everest Electronics", "Smart IT Hub", "Global Traders"];

  // Add Row
  const addRow = () => {
    setItems([
      ...items,
      {
        product: "",
        description: "",
        quantity: 0,
        unit: "pcs",
        unitPrice: 0,
        discountType: "%",
        discountValue: 0,
        total: 0,
      },
    ]);
  };

  // Update Row
  function updateRow<K extends keyof SalesItem>(index: number, field: K, value: SalesItem[K]) {
    const updated = [...items];
    updated[index][field] = value;

    // Product auto price & description
    if (field === "product") {
      const price = products[value as string] || 0;
      updated[index].unitPrice = price;
      if (!updated[index].description) {
        updated[index].description = `${value}`;
      }
    }

    // Recalculate total with discount
    const item = updated[index];
    let lineTotal = item.quantity * item.unitPrice;

    if (item.discountType === "%") {
      lineTotal -= (lineTotal * item.discountValue) / 100;
    } else {
      lineTotal -= item.discountValue;
    }

    updated[index].total = Math.max(lineTotal, 0); // prevent negative

    setItems(updated);
  }

  // Totals
  const subtotal = items.reduce((sum, r) => sum + r.total, 0);
  const discountApplied = Math.min(discount, subtotal);
  const vat = (subtotal - discountApplied) * 0.13;
  const grandTotal = subtotal - discountApplied + vat;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Dashboard</span>
          <span>/</span>
          <span>Sales</span>
          <span>/</span>
          <span className="font-semibold text-gray-900">New Sales Entry</span>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700">Save Sale</button>
      </div>

      {/* Customer & Invoice Info */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Sales Overview</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-gray-600">Customer Name</label>
            <select className="w-full rounded-lg border px-3 py-2">
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">Invoice Number</label>
            <input type="text" className="w-full rounded-lg border px-3 py-2" placeholder="SI01-ORG-0001" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">Sales Date</label>
            <input type="date" className="w-full rounded-lg border px-3 py-2" defaultValue="2025-08-29" />
          </div>
        </div>
      </div>

      {/* Sales Items */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Sales Items</h2>
        <table className="w-full overflow-hidden rounded-lg border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm text-gray-600">No</th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">Product</th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">Description</th>
              <th className="px-4 py-2 text-left text-sm text-gray-600">Unit</th>
              <th className="px-4 py-2 text-right text-sm text-gray-600">Quantity</th>
              <th className="px-4 py-2 text-right text-sm text-gray-600">Unit Price</th>
              <th className="px-4 py-2 text-right text-sm text-gray-600">Discount</th>
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
                  <select
                    value={item.unit}
                    onChange={(e) => updateRow(idx, "unit", e.target.value)}
                    className="w-full rounded border px-2 py-1"
                  >
                    {units.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
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
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={item.discountValue || ""}
                      onChange={(e) => updateRow(idx, "discountValue", Number(e.target.value))}
                      className="w-full rounded border px-2 py-1 text-right"
                    />
                    <select
                      value={item.discountType}
                      onChange={(e) => updateRow(idx, "discountType", e.target.value as "%" | "amt")}
                      className="rounded border px-2 py-1"
                    >
                      <option value="%">%</option>
                      <option value="amt">Amt</option>
                    </select>
                  </div>
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
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
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
            <label className="mb-1 block text-sm text-gray-600">Extra Discount</label>
            <input
              type="number"
              className="w-full rounded-lg border px-3 py-2 text-red-600"
              value={discount || ""}
              onChange={(e) => setDiscount(Number(e.target.value))}
              placeholder="0"
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
