import ClientSessionProvider from "@/components/ClientSessionProvider";
import { authOptions } from "@/constants/auth";
import LocaleContext from "@/context/LocaleContext";
import QueryClientContextProvider from "@/context/QueryClientContextProvider";
import type { Metadata, Viewport } from "next";
import { getServerSession } from "next-auth";
import { Roboto } from "next/font/google";
import "./globals.scss";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"], // Puedes incluir otros pesos si los necesitas
  subsets: ["latin"], // Puedes agregar otros subconjuntos si es necesario
  display: "swap", // Configura 'swap' para que la fuente se cargue de manera más eficiente
});

export const metadata: Metadata = {
  title: "Slotify",
  description: "Agendamiento de citas",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Ya tienes esto correctamente
  height: "device-height",
  viewportFit: "cover", // Permite cubrir todo el área visible de la pantalla en dispositivos con notch o barras flotantes.
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang='es' style={{ fontSize: "0.9rem" }}>
      <head>
        <meta httpEquiv='Content-Language' content='es' />
        <meta name='google' content='notranslate' />
        <meta name='theme-color' content='#317EFB' />
        <meta name='apple-mobile-web-app-status-bar-style' content='black' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <script src='https://kit.fontawesome.com/49a17ce65c.js' crossOrigin='anonymous' async />
      </head>
      <body className={roboto.className}>
        <QueryClientContextProvider>
          <LocaleContext>
            <ClientSessionProvider session={session}>{children}</ClientSessionProvider>
          </LocaleContext>
        </QueryClientContextProvider>
      </body>
    </html>
  );
}
