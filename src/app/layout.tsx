import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vincent Castro",
  description: "A modern Next.js starter with TypeScript, Tailwind CSS, shadcn/ui, and Font Awesome.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${inter.variable} h-full antialiased theme-loading`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              const root = document.documentElement;
              const savedTheme = localStorage.getItem("theme");
              const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
              const isDark = savedTheme === "dark" || (savedTheme !== "light" && prefersDark);

              root.classList.toggle("dark", isDark);
              root.classList.remove("theme-loading");
            })();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
