"use client";

import React, { useEffect, useState } from "react";
import { MoreHorizontal, Package, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Payroll } from "@/app/(main)/features/payrolls/types/payrolls";
import PayrollService from "@/app/(main)/features/payrolls/services/payroll-service";

export default function PayrollDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        setLoading(true);
        const data = await PayrollService.getAll();
        setPayrolls(data);
      } catch (error) {
        console.error("Failed to fetch payrolls:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayrolls();
  }, []);

  const filteredPayrolls = payrolls.filter(
    (p) =>
      p.remarks?.toLowerCase().includes(searchTerm.toLowerCase()) ??
      p.currency.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredPayrolls.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayrolls = filteredPayrolls.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const getStatusBadge = (status?: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "PROCESSED":
      case "APPROVED":
        return `${baseClasses} bg-blue-100 text-blue-700`;
      case "PENDING":
        return `${baseClasses} bg-orange-100 text-orange-700`;
      case "REJECTED":
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
            <p className="text-muted-foreground mt-1 text-sm">Manage payroll processing, approvals, and reports</p>
          </div>
          <Button className="flex items-center gap-2 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Create Payroll
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Payroll List</CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    placeholder="Search payrolls..."
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
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading payrolls...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="p-4 text-left font-medium text-gray-700">Employee ID</th>
                      <th className="p-4 text-left font-medium text-gray-700">Net Salary</th>
                      <th className="p-4 text-left font-medium text-gray-700">Currency</th>
                      <th className="p-4 text-left font-medium text-gray-700">Payment Date</th>
                      <th className="p-4 text-left font-medium text-gray-700">Status</th>
                      <th className="p-4 text-left font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPayrolls.map((payroll) => (
                      <tr key={payroll.id}>
                        <td className="p-4 text-gray-600">{payroll.employeeId}</td>
                        <td className="p-4 font-medium text-gray-900">{payroll.netSalary}</td>
                        <td className="p-4 text-gray-600">{payroll.currency}</td>
                        <td className="p-4 text-gray-600">{new Date(payroll.paymentDate).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span className={getStatusBadge(payroll.status)}>{payroll.status ?? "N/A"}</span>
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
            )}

            {/* Pagination */}
            {!loading && (
              <div className="flex items-center justify-between border-t bg-gray-50 p-4 dark:bg-gray-900">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredPayrolls.length)} of {filteredPayrolls.length}{" "}
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
            )}
          </CardContent>
        </Card>
      </div>
    </Card>
  );
}
