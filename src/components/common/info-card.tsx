import React, { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Users, AlertCircle, Loader, Lock, Inbox } from "lucide-react";

export enum InfoCardType {
  NO_DATA = "no-data",
  ERROR = "error",
  UNAUTHORIZED = "unauthorized",
  EMPTY_LIST = "empty-list",
}

interface InfoCardProps {
  type?: InfoCardType;
  message?: string;
  title?: string;
  icon?: ReactNode;
  iconClassName?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ type = InfoCardType.NO_DATA, message, title, icon, iconClassName }) => {
  let defaultIcon: ReactNode;
  let defaultTitle: string;
  let defaultMessage: string;

  const defaultIconClass = "h-12 w-12 mx-auto mb-4";

  switch (type) {
    case InfoCardType.ERROR:
      defaultIcon = <AlertCircle className={`${defaultIconClass} text-red-500`} />;
      defaultTitle = "Error";
      defaultMessage = "Something went wrong. Please try again.";
      break;
    case InfoCardType.UNAUTHORIZED:
      defaultIcon = <Lock className={`${defaultIconClass} text-yellow-500`} />;
      defaultTitle = "Unauthorized";
      defaultMessage = "You do not have permission to view this content.";
      break;
    case InfoCardType.EMPTY_LIST:
      defaultIcon = <Inbox className={`${defaultIconClass} text-muted-foreground`} />;
      defaultTitle = "No items";
      defaultMessage = "Your list is currently empty.";
      break;
    case InfoCardType.NO_DATA:
    default:
      defaultIcon = <Users className={`${defaultIconClass} text-muted-foreground`} />;
      defaultTitle = "No users found";
      defaultMessage = "Try adjusting your search terms or filters.";
      break;
  }

  const finalIcon = <div className={iconClassName ?? defaultIconClass}>{icon ?? defaultIcon}</div>;

  return (
    <Card className="p-12 text-center">
      {finalIcon}
      <h3 className="mb-2 text-lg font-medium">{title ?? defaultTitle}</h3>
      <p className="text-muted-foreground">{message ?? defaultMessage}</p>
    </Card>
  );
};

export default InfoCard;
