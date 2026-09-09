import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import ViewportToggle from "@/components/ui/ViewportToggle";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Portal Nova Acrópole",
  description: "Portal do Membro & BPO Financeiro",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${cinzel.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="min-h-full font-sans">
        <ViewportToggle>{children}</ViewportToggle>
      </body>
    </html>
  );
}
