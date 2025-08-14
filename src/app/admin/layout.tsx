
"use client";

// This layout simply passes children through. 
// The actual layout component is applied in the root layout.
export default function AdminSegmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
