import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const employeeTypeData = [
  { name: "Onsite", value: 800, color: "#3b82f6" },
  { name: "Remote", value: 105, color: "#f97316" },
  { name: "Hybrid", value: 95, color: "#06b6d4" },
];

export default function EmployeeTypeChart() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Employee Type</CardTitle>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="relative h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={employeeTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                {employeeTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">1000</div>
              <div className="text-sm text-gray-500">Employee</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
