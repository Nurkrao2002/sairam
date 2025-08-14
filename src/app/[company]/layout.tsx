

import React from "react";

// This layout is now primarily for structure within the [company] route group.
// The main logic has been moved to the root layout.
export default function CompanySpecificLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
