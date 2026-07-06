import type { Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CommandPalette } from "@/components/search/command-palette";
import { ChatWidget } from "@/components/assistant/chat-widget";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const lexend = Lexend({ variable: "--font-lexend", subsets: ["latin"], display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://climate-bonds-taxonomy-explorer.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Climate Bonds Taxonomy Explorer",
    template: "%s | Climate Bonds Taxonomy Explorer",
  },
  description:
    "Explore every Climate Bonds Taxonomy pathway, certification criteria, sector guidance, resilience framework, and sustainable finance opportunity from one interactive platform.",
  keywords: [
    "Climate Bonds Taxonomy",
    "Climate Bonds Standard",
    "green bonds",
    "sustainable finance",
    "climate resilience taxonomy",
    "certification criteria",
    "blue bonds",
    "methane abatement",
  ],
  openGraph: {
    title: "Climate Bonds Taxonomy Explorer",
    description:
      "The interactive knowledge platform for the Climate Bonds Taxonomy: Mitigation, Resilience, Blue and Methane Abatement.",
    url: siteUrl,
    siteName: "Climate Bonds Taxonomy Explorer",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Climate Bonds Taxonomy Explorer",
    description:
      "The interactive knowledge platform for the Climate Bonds Taxonomy: Mitigation, Resilience, Blue and Methane Abatement.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${lexend.variable} min-h-screen flex flex-col antialiased`}>
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CommandPalette />
          <ChatWidget />
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
