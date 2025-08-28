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
        { name: "Jan 2025", value: 12000 },
        { name: "Feb 2025", value: 15000 },
        { name: "Mar 2025", value: 18000 },
        { name: "Apr 2025", value: 20000 },
        { name: "May 2025", value: 17000 },
        { name: "Jun 2025", value: 22000 },
        { name: "Jul 2025", value: 19000 },
        { name: "Aug 2025", value: 24000 },
        { name: "Sep 2025", value: 21000 },
        { name: "Oct 2025", value: 25000 },
        { name: "Nov 2025", value: 23000 },
        { name: "Dec 2025", value: 26000 },
      ];

    case "quarterly":
      return [
        { name: "Q1 2025", value: 45000 },
        { name: "Q2 2025", value: 59000 },
        { name: "Q3 2025", value: 64000 },
        { name: "Q4 2025", value: 74000 },
      ];

    case "yearly":
      return [
        { name: "2022", value: 210000 },
        { name: "2023", value: 245000 },
        { name: "2024", value: 275000 },
        { name: "2025", value: 310000 },
      ];

    default:
      return [];
  }
}

export function getTopSalesCategories(): RevenuePoint[] {
  return [
    { name: "Electronics", value: 12420 },
    { name: "Home Appliances", value: 9200 },
    { name: "Fashion", value: 8600 },
    { name: "Books", value: 4200 },
    { name: "Toys", value: 2100 },
    { name: "Stationery", value: 900 },
  ];
}
