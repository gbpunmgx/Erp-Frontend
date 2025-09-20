import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const attendanceData = [
  { month: "Jan", onTime: 60, late: 25, absent: 15 },
  { month: "Feb", onTime: 65, late: 20, absent: 15 },
  { month: "Mar", onTime: 70, late: 20, absent: 10 },
  { month: "Apr", onTime: 55, late: 35, absent: 10 },
  { month: "May", onTime: 75, late: 15, absent: 10 },
];

export default function AttendanceChart() {
  return (
    <div className="lg:col-span-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Attendance Rate</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Bar dataKey="onTime" stackId="a" fill="#3b82f6" />
                <Bar dataKey="late" stackId="a" fill="#f97316" />
                <Bar dataKey="absent" stackId="a" fill="#6b7280" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
