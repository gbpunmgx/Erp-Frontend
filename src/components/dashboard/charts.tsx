import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

import { RevenuePoint } from "@/app/(main)/dashboard/types/types";

type Props = {
  data: RevenuePoint[];
  currency?: string;
  height?: number;
};

const formatCurrency = (value: number, currency = "USD") => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch (e) {
    return `${currency} ${Math.round(value).toLocaleString()}`;
  }
};

export default function SalesRevenueChart({ data, currency = "USD", height = 300 }: Props) {
  if (!data || data.length === 0) return null;
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v) => formatCurrency(v, currency)} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number) => formatCurrency(value, currency)}
            labelFormatter={(label: string) => `Period: ${label}`}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#059669"
            fillOpacity={1}
            fill="url(#colorRevenue)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
