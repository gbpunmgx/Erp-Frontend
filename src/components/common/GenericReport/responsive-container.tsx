import React from "react";

export const ResponsiveContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <div className={`mx-auto h-full w-full px-2 sm:px-4 lg:px-8 ${className}`}>{children}</div>;
