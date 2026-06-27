import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/providers/theme-provider";
import { JetBrains_Mono , Xanh_Mono ,Homemade_Apple, Baskervville } from 'next/font/google';
import AuthProvider from "@/components/shared/auth-provider";
import DesktopVersionBadge from "@/components/shared/desktop-version-badge";

const jetBrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['100','200','300','400','500','600','700','800'],
  display: 'swap',
});

export const homemadeApple = Homemade_Apple({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-homemade-apple",
});

const xanh = Xanh_Mono({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

const baskervville = Baskervville({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-baskervville",
});

export const metadata: Metadata = {
  title: "Evven",
  description: "Keep shared costs fair, clear, and totally handled. Evven makes group expense tracking simple and automated.",

  icons: {
    icon: "/EvenUp-white.svg",
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
      className={`${jetBrains.className} ${xanh.className} ${homemadeApple.variable} ${baskervville.className}  h-full antialiased`}
    >
      <head>
        <link 
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,301,400,401,500,501,700,701,900,901,1&display=swap" 
          rel="stylesheet" 
        />
        <link 
          href="https://api.fontshare.com/v2/css?f[]=dancing-script@400,700&display=swap" 
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <DesktopVersionBadge />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
