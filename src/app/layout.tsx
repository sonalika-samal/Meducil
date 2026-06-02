import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingHelp } from "@/components/layout/FloatingHelp";
import { CartProvider } from "@/lib/data/cartContext";
import { CartDrawer } from "@/components/layout/CartDrawer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meducil | Trusted Care For Better Health",
  description: "Trusted Homoeopathic Care. Natural Healing, Premium Remedies, No Side Effects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <CartProvider>
          <Header />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
          <FloatingHelp />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
