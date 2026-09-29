import type { Metadata } from "next";
import "./globals.css";
import { MainLayout } from "@/components/layout/MainLayout";

export const metadata: Metadata = {
  title: "TS DEV CRM — Internal CRM & Team Operations",
  description: "Internal CRM, project management, team workload and operations platform for freelance software development teams.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F8FAFC] text-[#0F172A] antialiased selection:bg-[#2563EB] selection:text-white">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
