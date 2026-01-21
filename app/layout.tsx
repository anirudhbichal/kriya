import type { Metadata } from "next";
import { 
  Space_Grotesk, 
  Inter, 
  Fraunces, 
  DM_Sans, 
  Bebas_Neue, 
  Work_Sans 
} from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store-context";
import { DataProvider } from "@/lib/data-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ThemeSwitcher from "@/components/ThemeSwitcher";

// Neon theme fonts
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Soft theme fonts
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

// Brutal theme fonts
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
});

export const metadata: Metadata = {
  title: "Kriya | E-commerce Made Simple",
  description: "Configurable e-commerce powered by Google Sheets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${spaceGrotesk.variable} 
          ${inter.variable} 
          ${fraunces.variable} 
          ${dmSans.variable}
          ${bebasNeue.variable}
          ${workSans.variable}
          antialiased
        `}
      >
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
      </body>
    </html>
  );
}
