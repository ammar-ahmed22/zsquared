import type { Metadata } from "next";
import {
  DM_Serif_Display,
  DM_Serif_Text,
  DM_Sans,
  DM_Mono,
} from "next/font/google";
import { ThemeProvider } from "@/context/theme";
import Navbar from "./components/navbar";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import Footer from "./components/footer";

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif-display",
  weight: "400",
});

const dmSerifText = DM_Serif_Text({
  variable: "--font-dm-serif-text",
  weight: "400",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Z Squared",
    default: "Z Squared",
    absolute: "Home | Z Squared",
  },
  icons: {
    icon: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },
  description:
    "Zaryab Ahmed and Zaid Marfatia's joint blog website where they write about Creed, Corporartions, Culture and everything in between.",
  openGraph: {}, // TODO: Add open graph meta tags - https://linear.app/ammar-ahmed/issue/AMM-74/add-og-metadata-with-gif-of-home-page
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider defaultTheme="dark" rootSelector=":root">
      <html
        lang="en"
        className={`${dmSerifDisplay.variable} ${dmSerifText.variable} ${dmSans.variable} ${dmMono.variable}`}>
        <body className="antialiased">
          <NextTopLoader color="var(--primary)" />
          <Navbar />
          <main className="mt-[15vh] px-3">{children}</main>
          <Footer />
        </body>
      </html>
    </ThemeProvider>
  );
}
