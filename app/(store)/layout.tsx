import type { Metadata } from "next";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Aqua",
  description: "Just a normal online shopping store.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body className={`antialiased`}>
          <Header />
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
