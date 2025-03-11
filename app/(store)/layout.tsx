import type { Metadata } from "next";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import { SanityLive } from "@/sanity/lib/live";
import { VisualEditing } from "next-sanity";
import { DisableDraftMode } from "@/components/DisableDraftMode";
import { draftMode } from "next/headers";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ModeToggle } from "@/components/ModeToggle";
import { getProductsWithCategories } from "@/sanity/lib/products/getAllProductsWithExpandedCategories";
import ChatToggle from "@/components/shopping-assistant/ChatToggle";

export const metadata: Metadata = {
  title: "Aqua",
  description: "Just a normal online shopping store.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const productsWithCategories = await getProductsWithCategories();

  return (
    <ClerkProvider dynamic>
      <html lang="en" suppressHydrationWarning>
        <body className={`antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main>
              {children}
              <SanityLive />
            </main>
            {(await draftMode()).isEnabled && (
              <>
                <VisualEditing />
                <DisableDraftMode />
              </>
            )}
            <ChatToggle products={productsWithCategories} />
            <ModeToggle />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
