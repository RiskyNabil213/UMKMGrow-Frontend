import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { KontenProvider } from "@/context/KontenContext";
import { ThemeProvider } from "@/context/ThemeContext";
import AppShell from "@/components/AppShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UMKM Grow+ | Solusi Digital UMKM",
  description: "Platform AI untuk memajukan UMKM Indonesia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <ThemeProvider>
            <KontenProvider>
              <AppShell>{children}</AppShell>
            </KontenProvider>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
