import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });
import type { Metadata } from "next";
import { Footer, Header } from "@/components";
import { getTenantData } from "@/utils/helper";

export const metadata: Metadata = {
  title: {
    template: '%s | Dashboard',
    default: 'Dashboard',
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const domain = headersList.get('host')?.split(':')[0];
  const data = await getTenantData(domain!);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>

        {/* <!-- CSS --> */}
        <link rel="stylesheet" href="/css/bootstrap.min.css" type="text/css"></link>
        <link rel="stylesheet" href="/css/bootstrap.min.css" type="text/css"></link>
        <link rel="stylesheet" href="/css/cms-styles.css" type="text/css"></link>

        {/* <!-- MUI Styles --> */}
        <link rel="stylesheet" href="/css/mui-styles.css" type="text/css"></link>

        {/* <!-- Favicons --> */}
        <link rel="icon" href={`/sites/${domain}/favicon.ico`}></link>

        <script src="/js/jquery-3.6.0.min.js" defer></script>
        <script src="/js/bootstrap.min.js" defer></script>
        <script src="/js/cms-header.js" defer></script>
      </head>
      <body className={inter.className}>
        <main id ="main-container" className="container-fluid p-0">
            <Header key={`header-${domain}`} html={data?.header}></Header>
            <div className="container">
              {children}
            </div>
            <Footer key={`footer-${domain}`} html={data?.footer}></Footer>
          <script async src="/js/copyright.js"></script> 
        </main>
      </body>
    </html>
  );
}
