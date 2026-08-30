import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import SplashScreen from "@/components/SplashScreen";

export const metadata: Metadata = {
  title: "Vendly - Buy & Sell with Trust",
  description: "Secure escrow marketplace. Verified vendors. No scams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SplashScreen />
        <main className="pb-20">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
