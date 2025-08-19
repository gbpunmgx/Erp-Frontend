import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Package, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      {/* Top Stats Row */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="w-full py-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <CardDescription>Till Date</CardDescription>
            </div>
            <Package className="text-muted-foreground h-6 w-6" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1,525</p>
          </CardContent>
        </Card>

        <Card className="w-full py-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <CardDescription>Till Date</CardDescription>
            </div>
            <ShoppingCart className="text-muted-foreground h-6 w-6" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">10,892</p>
          </CardContent>
        </Card>

        <Card className="w-full py-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <CardDescription>This Month</CardDescription>
            </div>
            <DollarSign className="text-muted-foreground h-6 w-6" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">$157,342</p>
          </CardContent>
        </Card>

        <Card className="w-full py-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <CardDescription>This Month</CardDescription>
            </div>
            <TrendingUp className="text-muted-foreground h-6 w-6" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">$12,453</p>
          </CardContent>
        </Card>
      </div>

      {/* Middle Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Sales Revenue</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                Monthly
              </Button>
              <Button size="sm" variant="ghost">
                Quarterly
              </Button>
              <Button size="sm" variant="ghost">
                Yearly
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Replace with a chart component like recharts */}
            <div className="text-muted-foreground flex h-64 items-center justify-center rounded-md border">
              Chart Placeholder
            </div>
          </CardContent>
        </Card>

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
