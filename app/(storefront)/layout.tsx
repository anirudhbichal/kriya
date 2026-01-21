'use client';

import { StoreProvider } from "@/lib/store-context";
import { DataProvider } from "@/lib/data-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DataProvider>
      <StoreProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <CartDrawer />
        <ThemeSwitcher />
      </StoreProvider>
    </DataProvider>
  );
}
