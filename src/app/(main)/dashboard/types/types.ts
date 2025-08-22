export interface TopCardProps {
  title: string;
  description: string;
  value: string | number;
  icon?: React.ReactNode;
  hoverColor?: string;
}

export interface RevenuePoint {
  date: string;
  revenue: number;
}
