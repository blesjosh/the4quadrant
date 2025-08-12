import type { Metadata } from "next";
import { Inter, Instrument_Serif } from 'next/font/google'
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'], // Choose weights you need
  variable: '--font-instrument-serif',
})


export const metadata: Metadata = {
  title: "the4Quadrants",
  description: "A Kanban board application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.variable} ${instrumentSerif.variable}`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
