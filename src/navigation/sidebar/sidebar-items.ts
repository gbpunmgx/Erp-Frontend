import {
  BookA,
  BoxesIcon,
  Building,
  Building2,
  Clock,
  CreditCard,
  Crown,
  FileText,
  Globe,
  History,
  Home,
  LockOpen,
  LucideIcon,
  MapPin,
  Package,
  ReceiptText,
  Settings,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Tag,
  UserCog,
  Zap,
} from "lucide-react";

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
        icon: Building2,
        subItems: [
          {
            title: "Organizations Type",
            url: "/features/organization/businessType",
            icon: Building,
          },
          {
            title: "All Organizations",
            url: "/features/organization/all",
            icon: Globe,
          },
        ],
      },
      {
        title: "Purchase",
        url: "/purchase",
        icon: ShoppingCart,
        subItems: [
          {
            title: "Purchase Entry",
            url: "/purchase",
            icon: Package,
          },
        ],
      },
      {
        title: "Categories",
        url: "/features/category",
        icon: Tag,
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
    label: "Inventory Management",
    items: [
      {
        title: "Product Management",
        url: "/features/product",
        icon: BoxesIcon,
        subItems: [
          {
            title: "product",
            url: "/features/product",
            icon: Building,
          },
          {
            title: "All Organizations",
            url: "/features/organization/all",
            icon: Globe,
          },
        ],
      },
      {
        title: "Purchase",
        url: "/purchase",
        icon: ShoppingCart,
        subItems: [
          {
            title: "Purchase Entry",
            url: "/purchase",
            icon: Package,
          },
        ],
      },
      {
        title: "Categories",
        url: "/features/category",
        icon: Tag,
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
        icon: FileText,
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
    label: "Live Location",
    items: [
      {
        title: "Live Location",
        url: "/features/live_location",
        icon: MapPin,
        subItems: [
          {
            title: "Live Location",
            url: "/features/live_location",
            icon: MapPin,
          },
        ],
      },
    ],
  },
  {
    id: 5,
    label: "Settings",
    items: [
      {
        title: "Users",
        url: "/features/users",
        icon: UserCog,
        subItems: [
          {
            title: "Access Control",
            url: "/features/access_control",
            icon: Shield,
          },
        ],
      },
    ],
  },
  {
    id: 6,
    label: "Subscription Management",
    items: [
      {
        title: "Subscriptions",
        url: "/features/subscriptions",
        icon: CreditCard,
        subItems: [
          {
            title: "All Subscriptions",
            url: "/features/subscriptions/all",
            icon: CreditCard,
          },
          {
            title: "Active Plans",
            url: "/features/subscriptions/active",
            icon: Zap,
          },
          {
            title: "Expired Plans",
            url: "/features/subscriptions/expired",
            icon: Clock,
          },
          {
            title: "Pending Renewals",
            url: "/features/subscriptions/renewals",
            icon: Settings,
          },
          {
            title: "Billing History",
            url: "/features/subscriptions/billing",
            icon: History,
          },
        ],
      },
      {
        title: "Plans & Pricing",
        url: "/features/plans",
        icon: Crown,
        subItems: [
          {
            title: "Subscription Plans",
            url: "/features/plans/all",
            icon: ShoppingBag,
          },
          {
            title: "Plan Features",
            url: "/features/plans/features",
            icon: Zap,
          },
          {
            title: "Pricing Tiers",
            url: "/features/plans/pricing",
            icon: Tag,
          },
          {
            title: "Custom Plans",
            url: "/features/plans/custom",
            icon: Crown,
            comingSoon: true,
          },
        ],
      },
    ],
  },
];
