import type { Metadata } from "next";
import { Suspense } from "react";
import Providers from "./providers";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Goforit",
  description: "Google Form Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
