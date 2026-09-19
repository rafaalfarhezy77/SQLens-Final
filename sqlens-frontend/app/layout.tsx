import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SQLens — Database Query Tutor",
    template: "%s | SQLens",
  },
  description:
    "Learn SQL by seeing how your queries process data step by step. Query-to-Visual Explanation platform for university students.",
  keywords: [
    "SQL",
    "Database Query Tutor",
    "SQL Visualizer",
    "Query Execution",
    "Next.js App Router",
    "React Server Components",
    "Neo-Brutalism",
  ],
  authors: [{ name: "SQLens Team & Student" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-[#F7F7F2] text-[#111111] antialiased min-h-screen bg-grid-pattern selection:bg-[#FFD600] selection:text-[#111111]">
        {children}
      </body>
    </html>
  );
}
