import ClientSessionProvider from "@/components/ClientSessionProvider";
import { authOptions } from "@/constants/auth";
import LocaleContext from "@/context/LocaleContext";
import QueryClientContextProvider from "@/context/QueryClientContextProvider";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Slotify",
  description: "Agendamiento de citas",
  manifest: "/manifest.json",
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
        <meta charSet='UTF-8' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
        />
        <meta httpEquiv='Content-Language' content='es' />
        <meta name='google' content='notranslate' />
        <meta name='theme-color' content='#317EFB' />
        <link rel='icon' href='/icons/icon-192x192.png' />
      </head>
      <body>
        <QueryClientContextProvider>
          <LocaleContext>
            <ClientSessionProvider session={session}>{children}</ClientSessionProvider>
          </LocaleContext>
        </QueryClientContextProvider>
      </body>
    </html>
  );
}
