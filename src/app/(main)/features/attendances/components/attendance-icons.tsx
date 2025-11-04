"use client";

import React from "react";
import { XCircle } from "lucide-react";

function getAttendanceIcon(status: string) {
  switch (status) {
    case "present":
      return <span className="mx-auto inline-block h-2.5 w-2.5 rounded-full bg-blue-500" title="Present" />;
    case "absent":
      return (
        <span title="Absent">
          <XCircle className="mx-auto h-4 w-4 text-red-500" />
        </span>
      );
    case "leave":
      return (
        <span className="font-bold text-yellow-500" title="Leave">
          L
        </span>
      );
    default:
      return (
        <span className="text-gray-400" title="No Data">
          –
        </span>
      );
  }
}

export default getAttendanceIcon;
