import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Switched to Outfit for Premium Look
import "./globals.css";
import { GoalProvider } from "@/context/GoalContext";
import { AuthProvider } from "@/context/AuthContext";

const outfit = Outfit({ subsets: ["latin"] });

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
      <body className={`${outfit.className} min-h-screen bg-background antialiased selection:bg-secondary/30`}>
        <AuthProvider>
          <GoalProvider>
            {children}
          </GoalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
