import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { TopCardProps } from "@/app/(main)/dashboard/types/types";

export default function TopCard({ title, description, value, icon, hoverColor }: TopCardProps) {
  return (
    <Card className={`w-full border-2 py-3 transition-all duration-300 ease-in-out hover:shadow-sm ${hoverColor} `}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
