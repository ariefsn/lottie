import { LayoutResponsive, StoreProvider, UIProvider } from "@/components";
import { Header, NavBarFilter } from "@/components/molecules";
import { ColorSchemeScript, Container } from "@mantine/core";
import '@mantine/core/styles.css';
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const monserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: 'Lottie App!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en">
        <head>
          <ColorSchemeScript />
        </head>
        <body className={monserrat.className}>
          <UIProvider>
            <LayoutResponsive header={<Header />} navbar={<NavBarFilter />}>
              <Container fluid>
                <main>{children}</main>
              </Container>
            </LayoutResponsive>
          </UIProvider>
        </body>
      </html>
    </StoreProvider>
  );
}
