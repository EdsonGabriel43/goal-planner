import type { Metadata } from "next";
import { Inter } from "next/font/google"; // or Outfit if requested, sticking to defaults first but Inter is good
import "./globals.css";
import { GoalProvider } from "@/context/GoalContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Planejador de Metas Premium",
  description: "Transforme seus sonhos em realidade com planejamento estruturado.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background antialiased selection:bg-primary/20`}>
        <GoalProvider>
          {children}
        </GoalProvider>
      </body>
    </html>
  );
}
