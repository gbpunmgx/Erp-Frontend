"use client";
import React from "react";

interface SectionHeadingProps {
  title: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ title }) => {
  return <h2 className="text-2xl font-bold tracking-tight">{title}</h2>;
};

export default SectionHeading;
