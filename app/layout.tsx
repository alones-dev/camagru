import type { Metadata } from "next";
import Providers from "./Providers";
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
