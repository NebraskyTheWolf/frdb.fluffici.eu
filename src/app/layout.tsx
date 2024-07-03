"use client";

import { Inter as FontSans } from "next/font/google";
import "../styles/globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/themes";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import React from "react";
import Toast from "@/components/toast.tsx";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased dark",
          fontSans.variable
        )}
      >
      <SessionProvider>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Footer />
          <Toast />
        </ThemeProvider>
      </SessionProvider>
      </body>
    </html>
  );
}
