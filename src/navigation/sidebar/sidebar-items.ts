import { BookA, Home, LucideIcon, ReceiptText, ShoppingBag, Users } from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Dashboard",
    items: [
      {
        title: "Overview",
        url: "/dashboard",
        icon: Home,
      },
    ],
  },
  {
    id: 2,
    label: "Organization Management",
    items: [
      {
        title: "Organizations",
        url: "/features/organization",
        icon: Users,
        subItems: [
          {
            title: "Organizations Type",
            url: "/features/organization/businessType",
            icon: Users,
          },
          {
            title: "All Organizations",
            url: "/features/organization/all",
            icon: Users,
          },
        ],
      },
      {
        title: "Purchase",
        url: "/purchase",
        icon: Users,
        subItems: [
          {
            title: "Purchase Entry",
            url: "/purchase",
            icon: Users,
          },
        ],
      },
      {
        title: "Categories",
        url: "/features/category",
        icon: BookA,
        subItems: [
          {
            title: "All Categories",
            url: "/features/category",
            icon: BookA,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    label: "Voucher",
    items: [
      {
        title: "Voucher",
        url: "/features/voucher",
        icon: ReceiptText,
        subItems: [
          {
            title: "Voucher",
            url: "/features/voucher",
            icon: ReceiptText,
          },
        ],
      },
    ],
  },
  {
    id: 4,
    label: "Subscription Management",
    items: [
      {
        title: "Subscriptions",
        url: "/features/subscriptions",
        icon: ReceiptText,
        subItems: [
          {
            title: "All Subscriptions",
            url: "/features/subscriptions/all",
            icon: ReceiptText,
          },
          {
            title: "Active Plans",
            url: "/features/subscriptions/active",
          },
          {
            title: "Expired Plans",
            url: "/features/subscriptions/expired",
          },
          {
            title: "Pending Renewals",
            url: "/features/subscriptions/renewals",
          },
          {
            title: "Billing History",
            url: "/features/subscriptions/billing",
          },
        ],
      },
      {
        title: "Plans & Pricing",
        url: "/features/plans",
        icon: ShoppingBag,
        subItems: [
          {
            title: "Subscription Plans",
            url: "/features/plans/all",
            icon: ShoppingBag,
          },
          {
            title: "Plan Features",
            url: "/features/plans/features",
          },
          {
            title: "Pricing Tiers",
            url: "/features/plans/pricing",
          },
          {
            title: "Custom Plans",
            url: "/features/plans/custom",
            comingSoon: true,
          },
        ],
      },
    ],
  },
];
