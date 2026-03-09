import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plano de Governo Interativo — Tocantins",
  description:
    "Conheça o plano de governo para o Tocantins de forma interativa. Navegue por eixos temáticos, explore dados de 139 municípios e veja propostas conectadas à realidade do seu território.",
  keywords: [
    "Tocantins",
    "plano de governo",
    "políticas públicas",
    "municípios",
    "desenvolvimento regional",
  ],
  openGraph: {
    title: "Plano de Governo Interativo — Tocantins",
    description:
      "Propostas baseadas em dados reais para os 139 municípios do Tocantins.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
