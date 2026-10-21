import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";
import { personal } from "@/data/personal";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400"],
});

import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Zain Awan",
    default: "Zain Awan | Full Stack Developer",
  },
  description:
    "Portfolio of Zain Awan — Full Stack Developer and AI enthusiast from Pakistan. Building modern web applications with React, Next.js, and AI-powered features.",
  keywords: [
    "Zain Awan",
    "Full Stack Developer",
    "Next.js Developer",
    "React Developer",
    "AI Developer Pakistan",
    "Portfolio",
  ],
  authors: [{ name: "Zain Awan", url: SITE_URL }],
  creator: "Zain Awan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Zain Awan | Full Stack Developer",
    title: "Zain Awan | Full Stack Developer",
    description:
      "Portfolio of Zain Awan — Full Stack Developer and AI enthusiast from Pakistan. Building modern web applications with React, Next.js, and AI-powered features.",
    url: SITE_URL,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Zain Awan — Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zain Awan | Full Stack Developer",
    description:
      "Portfolio of Zain Awan — Full Stack Developer and AI enthusiast from Pakistan. Building modern web applications with React, Next.js, and AI-powered features.",
    images: ["/opengraph-image"],
  },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "Ynja1jLHsrHaKy_9lCr3F29nOZxhWuhDN-d_4gdNvU0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("dark", "antialiased", syne.variable, dmSans.variable, jetbrainsMono.variable)}>
      <body className="min-h-screen bg-background text-foreground font-body">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SmoothScrollProvider>
            <CustomCursor />
            <Navbar />
            <main className="pt-20">{children}</main>
            <Footer />
            <ChatbotWidget />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
