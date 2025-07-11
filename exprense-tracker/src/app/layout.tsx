import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RootProviders from "@/components/RootProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finance Tracker",
  description: "Track your expenses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark"
    style={{
      colorScheme:"dark"
    }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      ><RootProviders>
        { children }
      </RootProviders>
      </body>
    </html>
  );
}
