"use client";
import React, { useState } from "react";
import { Search, Download, Plus, MoreHorizontal, ChevronDown, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

// Payroll Summary Data
const payrollSummaryData = [
  { month: "Jan", grossSalary: 60000, netSalary: 45000, taxDeduction: 15000 },
  { month: "Feb", grossSalary: 75000, netSalary: 57000, taxDeduction: 18000 },
  { month: "Mar", grossSalary: 70000, netSalary: 53000, taxDeduction: 17000 },
  { month: "Apr", grossSalary: 45000, netSalary: 34000, taxDeduction: 11000 },
  { month: "May", grossSalary: 65000, netSalary: 49000, taxDeduction: 16000 },
  { month: "Jun", grossSalary: 70000, netSalary: 53000, taxDeduction: 17000 },
  { month: "Jul", grossSalary: 68000, netSalary: 51000, taxDeduction: 17000 },
  { month: "Aug", grossSalary: 72000, netSalary: 54000, taxDeduction: 18000 },
  { month: "Sep", grossSalary: 65000, netSalary: 49000, taxDeduction: 16000 },
  { month: "Oct", grossSalary: 70000, netSalary: 53000, taxDeduction: 17000 },
  { month: "Nov", grossSalary: 68000, netSalary: 51000, taxDeduction: 17000 },
  { month: "Dec", grossSalary: 80000, netSalary: 60000, taxDeduction: 20000 },
];

// Company Pay Data
const companyPayData = [
  { name: "Salary", value: 15, color: "#ef4444" },
  { name: "Bonus", value: 8, color: "#22c55e" },
  { name: "Commission", value: 20, color: "#3b82f6" },
  { name: "Overtime", value: 11, color: "#f97316" },
  { name: "Reimbursement", value: 28, color: "#06b6d4" },
  { name: "Benefits", value: 18, color: "#fbbf24" },
];

// Payroll List Data
const payrollListData = [
  {
    id: 1,
    name: "James Anderson",
    avatar: "https://ui-avatars.com/api/?name=James+Anderson&size=40&background=random",
    department: "Back-End Developer",
    totalDays: "30 Days",
    workingDay: "27 Days",
    totalSalary: "$22,250",
    overTime: "$1500",
    status: "Completed",
  },
  {
    id: 2,
    name: "William Johnson",
    avatar: "https://ui-avatars.com/api/?name=William+Johnson&size=40&background=random",
    department: "Full-Stack Developer",
    totalDays: "29 Days",
    workingDay: "18 Days",
    totalSalary: "$21,2500",
    overTime: "$1800",
    status: "Completed",
  },
  {
    id: 3,
    name: "Benjamin Martinez",
    avatar: "https://ui-avatars.com/api/?name=Benjamin+Martinez&size=40&background=random",
    department: "Mobile App Developer",
    totalDays: "28 Days",
    workingDay: "4 Days",
    totalSalary: "$22,250",
    overTime: "$2900",
    status: "Reject",
  },
  {
    id: 4,
    name: "Michael Davis",
    avatar: "https://ui-avatars.com/api/?name=Michael+Davis&size=40&background=random",
    department: "UI/UX Designer",
    totalDays: "27 Days",
    workingDay: "27 Days",
    totalSalary: "$86,000",
    overTime: "$400",
    status: "Pending",
  },
  {
    id: 5,
    name: "Matthew Taylor",
    avatar: "https://ui-avatars.com/api/?name=Matthew+Taylor&size=40&background=random",
    department: "DevOps Engineer",
    totalDays: "26 Days",
    workingDay: "30 Days",
    totalSalary: "$12,000",
    overTime: "$700",
    status: "Pending",
  },
  {
    id: 6,
    name: "David Wilson",
    avatar: "https://ui-avatars.com/api/?name=David+Wilson&size=40&background=random",
    department: "DevOps Engineer",
    totalDays: "25 Days",
    workingDay: "22 Days",
    totalSalary: "$30,000",
    overTime: "$1500",
    status: "Pending",
  },
  {
    id: 7,
    name: "Anthony Thomas",
    avatar: "https://ui-avatars.com/api/?name=Anthony+Thomas&size=40&background=random",
    department: "Back-End Developer",
    totalDays: "24 Days",
    workingDay: "22 Days",
    totalSalary: "$22,250",
    overTime: "$3000",
    status: "Reject",
  },
  {
    id: 8,
    name: "Christopher Moore",
    avatar: "https://ui-avatars.com/api/?name=Christopher+Moore&size=40&background=random",
    department: "Full-Stack Developer",
    totalDays: "23 Days",
    workingDay: "2 Days",
    totalSalary: "$75,200",
    overTime: "$1400",
    status: "Completed",
  },
  {
    id: 9,
    name: "Emma Smith",
    avatar: "https://ui-avatars.com/api/?name=Emma+Smith&size=40&background=random",
    department: "Mobile App Developer",
    totalDays: "22 Days",
    workingDay: "24 Days",
    totalSalary: "$22,250",
    overTime: "$800",
    status: "Pending",
  },
  {
    id: 10,
    name: "James Anderson",
    avatar: "https://ui-avatars.com/api/?name=James+Anderson+2&size=40&background=random",
    department: "UI/UX Designer",
    totalDays: "21 Days",
    workingDay: "4 Days",
    totalSalary: "$45,000",
    overTime: "$1500",
    status: "Pending",
  },
  {
    id: 11,
    name: "Sarah Wilson",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Wilson&size=40&background=random",
    department: "Frontend Developer",
    totalDays: "30 Days",
    workingDay: "28 Days",
    totalSalary: "$32,500",
    overTime: "$900",
    status: "Completed",
  },
  {
    id: 12,
    name: "Robert Brown",
    avatar: "https://ui-avatars.com/api/?name=Robert+Brown&size=40&background=random",
    department: "Data Analyst",
    totalDays: "29 Days",
    workingDay: "25 Days",
    totalSalary: "$28,750",
    overTime: "$1200",
    status: "Pending",
  },
  {
    id: 13,
    name: "Lisa Garcia",
    avatar: "https://ui-avatars.com/api/?name=Lisa+Garcia&size=40&background=random",
    department: "Product Manager",
    totalDays: "31 Days",
    workingDay: "30 Days",
    totalSalary: "$65,000",
    overTime: "$500",
    status: "Completed",
  },
  {
    id: 14,
    name: "Kevin Lee",
    avatar: "https://ui-avatars.com/api/?name=Kevin+Lee&size=40&background=random",
    department: "QA Engineer",
    totalDays: "28 Days",
    workingDay: "26 Days",
    totalSalary: "$24,800",
    overTime: "$700",
    status: "Pending",
  },
  {
    id: 15,
    name: "Michelle Chen",
    avatar: "https://ui-avatars.com/api/?name=Michelle+Chen&size=40&background=random",
    department: "Marketing Specialist",
    totalDays: "30 Days",
    workingDay: "29 Days",
    totalSalary: "$26,500",
    overTime: "$300",
    status: "Completed",
  },
  {
    id: 16,
    name: "Daniel Rodriguez",
    avatar: "https://ui-avatars.com/api/?name=Daniel+Rodriguez&size=40&background=random",
    department: "System Administrator",
    totalDays: "31 Days",
    workingDay: "28 Days",
    totalSalary: "$35,200",
    overTime: "$1100",
    status: "Reject",
  },
  {
    id: 17,
    name: "Amanda White",
    avatar: "https://ui-avatars.com/api/?name=Amanda+White&size=40&background=random",
    department: "HR Manager",
    totalDays: "30 Days",
    workingDay: "30 Days",
    totalSalary: "$55,000",
    overTime: "$200",
    status: "Completed",
  },
  {
    id: 18,
    name: "Ryan Thompson",
    avatar: "https://ui-avatars.com/api/?name=Ryan+Thompson&size=40&background=random",
    department: "Security Engineer",
    totalDays: "29 Days",
    workingDay: "27 Days",
    totalSalary: "$42,750",
    overTime: "$800",
    status: "Pending",
  },
  {
    id: 19,
    name: "Jessica Miller",
    avatar: "https://ui-avatars.com/api/?name=Jessica+Miller&size=40&background=random",
    department: "Content Writer",
    totalDays: "28 Days",
    workingDay: "25 Days",
    totalSalary: "$18,500",
    overTime: "$150",
    status: "Completed",
  },
  {
    id: 20,
    name: "Tyler Johnson",
    avatar: "https://ui-avatars.com/api/?name=Tyler+Johnson&size=40&background=random",
    department: "Cloud Architect",
    totalDays: "31 Days",
    workingDay: "31 Days",
    totalSalary: "$78,900",
    overTime: "$600",
    status: "Pending",
  },
];

export default function PayrollDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedFilter, setSelectedFilter] = useState("Yearly");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filter employees based on search term
  const filteredEmployees = payrollListData.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const getStatusBadge = (status: "Completed" | "Pending" | "Reject" | string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "Completed":
        return `${baseClasses} bg-blue-100 text-blue-700`;
      case "Pending":
        return `${baseClasses} bg-orange-100 text-orange-700`;
      case "Reject":
        return `${baseClasses} bg-red-100 text-red-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  };

  return (
    <Card className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div>
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-semibold">
              <Package className="text-primary h-8 w-8" />
              <span>Manage Payrolls</span>
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">Manage user roles, permissions, and access control</p>
          </div>
          <Button className="flex items-center gap-2 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Add Attachments
          </Button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Payroll Summary</CardTitle>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                  <ChevronDown className="ml-1 h-4 w-4" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="relative h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={payrollSummaryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      tickFormatter={(value) => `${value / 1000}K`}
                    />
                    <Bar dataKey="grossSalary" fill="#f97316" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="netSalary" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                {/* Line overlay for tax deduction */}
                <div className="pointer-events-none absolute inset-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={payrollSummaryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="month" hide />
                      <YAxis hide tickFormatter={(value) => `${value / 1000}K`} />
                      <Line
                        type="monotone"
                        dataKey="taxDeduction"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-gray-600">Gross Salary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600">Net Salary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Tax Deduction</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Pay Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Company Pay</CardTitle>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                  <ChevronDown className="ml-1 h-4 w-4" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="relative h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={companyPayData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {companyPayData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold">7433</div>
                    <div className="text-sm text-gray-500">Total Data</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {companyPayData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm font-medium">{item.value}%</span>
                      <span className="text-sm text-gray-500">{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t pt-4">
                <div className="mb-2 text-sm text-gray-500">2024 Download Report Company Trends and Insights</div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payroll List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Payroll List</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    placeholder="Search"
                    className="w-64 pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button size="sm">Download Report</Button>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="p-4 text-left font-medium text-gray-700">Name</th>
                    <th className="p-4 text-left font-medium text-gray-700">Department</th>
                    <th className="p-4 text-left font-medium text-gray-700">Total Days</th>
                    <th className="p-4 text-left font-medium text-gray-700">Working Day</th>
                    <th className="p-4 text-left font-medium text-gray-700">Total Salary</th>
                    <th className="p-4 text-left font-medium text-gray-700">Over Time</th>
                    <th className="p-4 text-left font-medium text-gray-700">Status</th>
                    <th className="p-4 text-left font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployees.map((employee, index) => (
                    <tr key={employee.id}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={employee.avatar} />
                            <AvatarFallback>
                              {employee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="bg-gray-50 font-medium dark:bg-gray-900">{employee.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{employee.department}</td>
                      <td className="p-4 text-gray-600">{employee.totalDays}</td>
                      <td className="p-4 text-gray-600">{employee.workingDay}</td>
                      <td className="p-4 font-medium text-gray-900">{employee.totalSalary}</td>
                      <td className="p-4 text-gray-600">{employee.overTime}</td>
                      <td className="p-4">
                        <span className={getStatusBadge(employee.status)}>{employee.status}</span>
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t bg-gray-50 p-4 dark:bg-gray-900">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredEmployees.length)} of {filteredEmployees.length}{" "}
                entries
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="text-gray-500"
                >
                  &lt;
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-8 w-8 p-0 ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="text-gray-500"
                >
                  &gt;
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Card>
  );
}
