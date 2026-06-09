import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catálogo de Vinhos",
  description: "Seu catálogo online de vinhos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-stone-50 text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}
