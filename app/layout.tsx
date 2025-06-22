import type React from "react";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";

const theSeasons = {
  src: [
    {
      path: "/fonts/TheSeasons-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "/fonts/TheSeasons-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-the-seasons",
  display: "swap",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jan Bennette & Hanna - Wedding",
  description: "Join us for our special day",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=The+Seasons:wght@400;700&display=swap"
          rel="preload"
          as="style"
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=The+Seasons:wght@400;700&display=swap"
            rel="stylesheet"
          />
        </noscript>
      </head>
      <body className="font-sans antialiased">
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
