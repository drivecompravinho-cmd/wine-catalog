import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "COMPRAVINHO",
  description: "Catálogo online de vinhos",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ background: "var(--surface-2)", color: "var(--text-1)" }}>{children}</body>
    </html>
  );
}
