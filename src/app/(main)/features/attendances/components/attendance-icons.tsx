"use client";
import React from "react";

export const getAttendanceIcon = (status: string) => {
  switch (status) {
    case "present":
      return (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
        </div>
      );
    case "absent":
      return (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
        </div>
      );
    case "late":
      return (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100">
          <div className="h-3 w-3 rounded-full bg-orange-500"></div>
        </div>
      );
    default:
      return (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
          <div className="h-3 w-3 rounded-full bg-gray-400"></div>
        </div>
      );
  }
};
