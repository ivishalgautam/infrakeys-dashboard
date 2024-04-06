import React from "react";

export default function Section({ children }) {
  return (
    <div className="space-y-4 overflow-y-auto bg-white p-10 rounded-xl">
      {children}
    </div>
  );
}
