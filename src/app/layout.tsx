"use client";

import AuthProvider from "./components/AuthProvider";
import "./globals.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>
          <AuthProvider>{children}</AuthProvider>
        </main>
      </body>
    </html>
  );
}
