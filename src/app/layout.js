"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";
import "./globals.css";
import ReduxProvider from "./redux/provider";
// import SideBar from "./Components/SideBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  // const [open, setOpen] = useState(true);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} `}
      >
        <ReduxProvider>
          {/* <SideBar open={open} setOpen={setOpen} /> flex h-screen overflow-hidden */}
          <main
            className={`flex-1 transition-all duration-300 bg-[#efeae2] 
            }`}
          >
            {children}
          </main>
        </ReduxProvider>
      </body>
    </html>
  );
}
