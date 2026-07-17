import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Desire Ledger",
  description: "Your personal bucket list — when to buy, how you use it, how it helps.",
  applicationName: "Desire Ledger",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Desire Ledger",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    apple: "/icons/icon-192.png",
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192" },
      { url: "/icons/icon-512.png", sizes: "512x512" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      allowedRedirectOrigins={appUrl ? [appUrl] : undefined}
      appearance={{
        variables: {
          colorPrimary: "#9fe870",
          colorBackground: "#ffffff",
          borderRadius: "1rem",
        },
      }}
    >
      <html
        lang="en"
        className={`${jakarta.variable} ${plexMono.variable} h-full antialiased`}
      >
        <body className="flex min-h-full flex-col font-sans">
          <AppShell>{children}</AppShell>
        </body>
      </html>
    </ClerkProvider>
  );
}
