"use client";

import React, { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, className = "" }) => {
  return <Card className={`min-h-screen w-full p-4 md:p-8 ${className}`}>{children}</Card>;
};
