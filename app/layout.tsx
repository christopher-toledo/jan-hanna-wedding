import { Navigation } from "@/components/navigation";
import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Montserrat,
  Pinyon_Script,
  League_Spartan,
} from "next/font/google";
import localFont from "next/font/local";
import type React from "react";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  variable: "--font-pinyon-script",
  display: "swap",
  weight: "400",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
  display: "swap",
  weight: ["400", "700"],
});

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-league-spartan",
  display: "swap",
  weight: ["400", "700"],
});

const brittanyFont = localFont({
  src: "../public/fonts/BrittanySignature.ttf",
  variable: "--font-brittany",
  display: "swap",
  weight: "400",
  style: "normal",
  fallback: ["cursive"],
});

const altaFont = localFont({
  src: "../public/fonts/alta-regular.otf",
  variable: "--font-alta",
  display: "swap",
  weight: "400",
  style: "normal",
  fallback: ["sans-serif"],
});

const theSeasons = localFont({
  src: [
    {
      path: "../public/fonts/theseasons-reg.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/theseasons-bd.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/theseasons-it.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/theseasons-bdit.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/theseasons-lt.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/theseasons-ltit.otf",
      weight: "300",
      style: "italic",
    },
  ],
  variable: "--font-the-seasons",
  display: "swap",
  fallback: ["serif"],
});

const westoniaFont = localFont({
  src: [
    {
      path: "../public/fonts/Westonia-7BGMl.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Westonia-mL7Mx.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-westonia",
  display: "swap",
  fallback: ["cursive"],
});

export const metadata: Metadata = {
  title: "Jan & Hanna - Wedding",
  description: "Join us for our special day",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${pinyon.variable} ${cormorant.variable} ${leagueSpartan.variable} ${brittanyFont.variable} ${altaFont.variable} ${theSeasons.variable} ${westoniaFont.variable}`}
    >
      <body className="font-sans antialiased">
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
