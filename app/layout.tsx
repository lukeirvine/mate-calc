import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mate Calc — Caffeine in Every Sip",
  description: "Calculate the caffeine content of your yerba mate by brew method, grams, refills, and water temperature.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧉</text></svg>",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="island-light"
      className={`${geist.variable} h-full antialiased`}
    >
      {/* Inline script prevents flash of wrong theme before hydration */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.setAttribute("data-theme",d?"island-dark":"island-light")}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${geist.variable} min-h-full`}>{children}</body>
    </html>
  );
}
