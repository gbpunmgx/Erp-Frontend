"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SalesRevenueChart from "./charts";
import { RevenuePoint } from "@/app/(main)/dashboard/types/types";
import { useState } from "react";
import { getSalesData, SalesPeriod } from "@/app/(main)/dashboard/services/chart-data";

export default function SalesRevenuePanel() {
  const [period, setPeriod] = useState<SalesPeriod>("monthly");
  const [data, setData] = useState<RevenuePoint[]>(getSalesData("monthly"));
  function loadPeriod(p: SalesPeriod) {
    setPeriod(p);
    setData(getSalesData(p));
  }
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Sales Revenue</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant={period === "monthly" ? "outline" : "ghost"} onClick={() => loadPeriod("monthly")}>
            Monthly
          </Button>
          <Button
            size="sm"
            variant={period === "quarterly" ? "outline" : "ghost"}
            onClick={() => loadPeriod("quarterly")}
          >
            Quarterly
          </Button>
          <Button size="sm" variant={period === "yearly" ? "outline" : "ghost"} onClick={() => loadPeriod("yearly")}>
            Yearly
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <SalesRevenueChart data={data} />
      </CardContent>
    </Card>
  );
}
