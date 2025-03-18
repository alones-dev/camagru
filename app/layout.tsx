import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Camagru",
  description: "Instagram-like with pictures and comments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
