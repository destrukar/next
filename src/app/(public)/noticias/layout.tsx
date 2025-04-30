"use client";

import { ReactQueryProvider } from "../../components/ReactQueryProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </section>
  );
}
