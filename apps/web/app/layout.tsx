import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Autometa – Revolutionize Your AI Experience",
  description:
    "All-in-one AI platform: developer tools, meeting copilots, image generation, dashboards, multilingual support, and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${plusJakarta.variable} font-sans antialiased bg-[#0B0F2A]`}>
        {children}
      </body>
    </html>
  );
}
