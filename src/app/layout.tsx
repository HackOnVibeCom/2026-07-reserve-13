import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeScript } from "@/components/theme-script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Tact: community posts that don't read like ads",
  description:
    "Tact helps indie builders promote a newly launched mobile app with soft community posts, spam-risk scoring, and venue-native drafts.",
  icons: {
    icon: "/brand/tact-icon-64.png",
    apple: "/brand/tact-logo-192.png",
  },
  openGraph: {
    title: "Tact",
    description:
      "Post about your new app without the hard sell. Soft drafts, spam contrast, deterministic risk.",
    images: [
      {
        url: "/brand/tact-buidl-logo.png",
        width: 1024,
        height: 1024,
        alt: "Tact logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
