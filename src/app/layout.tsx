import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import SplashScreen from "@/components/layout/SplashScreen";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SmartNav | Dhaka Navigation",
  description: "Dynamic routing and navigation system for Dhaka city.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <SplashScreen />
          
          <Sidebar />
          
          <main className="flex-1 ml-64 p-8">
            <div className="max-w-[1200px] mx-auto">
              {children}
            </div>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
