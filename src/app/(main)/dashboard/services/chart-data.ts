import { RevenuePoint } from "../types/types";

export type SalesPeriod = "monthly" | "quarterly" | "yearly";

/**
 * Dummy service function to fetch sales data
 * @param period "monthly" | "quarterly" | "yearly"
 */

export function getSalesData(period: SalesPeriod): RevenuePoint[] {
  switch (period) {
    case "monthly":
      return [
        { date: "Jan 2025", revenue: 12000 },
        { date: "Feb 2025", revenue: 15000 },
        { date: "Mar 2025", revenue: 18000 },
        { date: "Apr 2025", revenue: 20000 },
        { date: "May 2025", revenue: 17000 },
        { date: "Jun 2025", revenue: 22000 },
        { date: "Jul 2025", revenue: 19000 },
        { date: "Aug 2025", revenue: 24000 },
        { date: "Sep 2025", revenue: 21000 },
        { date: "Oct 2025", revenue: 25000 },
        { date: "Nov 2025", revenue: 23000 },
        { date: "Dec 2025", revenue: 26000 },
      ];

    case "quarterly":
      return [
        { date: "Q1 2025", revenue: 45000 },
        { date: "Q2 2025", revenue: 59000 },
        { date: "Q3 2025", revenue: 64000 },
        { date: "Q4 2025", revenue: 74000 },
      ];

    case "yearly":
      return [
        { date: "2022", revenue: 210000 },
        { date: "2023", revenue: 245000 },
        { date: "2024", revenue: 275000 },
        { date: "2025", revenue: 310000 },
      ];

    default:
      return [];
  }
}
