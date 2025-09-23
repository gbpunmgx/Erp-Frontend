import React from "react";
import { CardContent } from "@/components/ui/card";

export const ResponsiveTableContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full">
    <div>
      <CardContent className="h-full p-0">
        <div
          className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 relative overflow-x-auto"
          style={{ minWidth: 0 }}
        >
          <div className="inline-block min-w-full">{children}</div>
        </div>
      </CardContent>
    </div>
  </div>
);
