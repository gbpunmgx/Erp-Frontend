import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Package, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopCardProps } from "./types/types";
import TopCard from "@/components/dashboard/common-card";
import SalesRevenuePanel from "@/components/dashboard/charts-panel";

export default function Dashboard() {
  const stats: TopCardProps[] = [
    {
      title: "Total Products",
      description: "Till Date",
      value: "1,525",
      icon: <Package className="text-muted-foreground h-6 w-6" />,
      hoverColor: "hover:border-red-600",
    },
    {
      title: "Total Sales",
      description: "Till Date",
      value: "10,892",
      icon: <ShoppingCart className="text-muted-foreground h-6 w-6" />,
      hoverColor: "hover:border-blue-600",
    },
    {
      title: "Total Income",
      description: "This Month",
      value: "$157,342",
      icon: <DollarSign className="text-muted-foreground h-6 w-6" />,
      hoverColor: "hover:border-green-600",
    },
    {
      title: "Total Expenses",
      description: "This Month",
      value: "$17,342",
      icon: <TrendingUp className="text-muted-foreground h-6 w-6" />,
      hoverColor: "hover:border-purple-600",
    },
  ];
  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <TopCard key={i} {...stat} />
        ))}
      </div>

      {/* Middle Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <SalesRevenuePanel />
        {/* Top Categories Pie Chart */}

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Top Categories</CardTitle>
            <Button size="sm" variant="outline">
              See All
            </Button>
          </CardHeader>
          <CardContent>
            {/* Replace with Pie chart */}
            <div className="text-muted-foreground flex h-64 items-center justify-center rounded-md border">
              Pie Chart Placeholder
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button size="sm" variant="outline">
              See All
            </Button>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center justify-between">
                <span>Order #2048 - John Doe</span>
                <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">New Order</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Low Stock Alert - MacBook Air M2</span>
                <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-700">Low Stock</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Promo Code SUMMER20</span>
                <span className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-700">Campaign</span>
              </li>
              <li className="flex items-center justify-between">
                <span>System Update - v1.2.3</span>
                <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">System</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Top Products</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                Sort
              </Button>
              <Button size="sm" variant="outline">
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead className="text-muted-foreground">
                <tr className="text-left">
                  <th className="py-2">Product</th>
                  <th className="py-2">Stocks</th>
                  <th className="py-2">Price</th>
                  <th className="py-2">Sales</th>
                  <th className="py-2">Earnings</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>iPhone 15 Pro</td>
                  <td>6200</td>
                  <td>$999</td>
                  <td>4800</td>
                  <td>$4,796,200</td>
                </tr>
                <tr>
                  <td>MacBook Air M2</td>
                  <td>1020</td>
                  <td>$1299</td>
                  <td>3200</td>
                  <td>$4,156,800</td>
                </tr>
                <tr>
                  <td>Google Pixel 8</td>
                  <td>1500</td>
                  <td>$899</td>
                  <td>800</td>
                  <td>$659,200</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
