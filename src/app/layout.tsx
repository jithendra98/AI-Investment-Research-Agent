import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Investment Research Agent | InsideIIM × Altuni",
  description:
    "AI-powered investment research agent that analyzes stocks using multi-agent architecture. Get comprehensive research reports with financial analysis, sentiment tracking, risk assessment, and actionable recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-background text-foreground min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
