"use client";

import { useState } from "react";

type Props = {
  label: string;
  value: string;
  displayValue?: string; // Optional short display version
};

export const CopyField = ({ label, value, displayValue }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="py-4 px-2 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-300">
      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-0">
        {label}
      </label>
      <div className="flex items-center">
        <span className="mr-2 font-mono text-gray-800 break-all">
          {displayValue ?? value}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors duration-200"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
};
