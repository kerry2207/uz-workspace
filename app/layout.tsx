import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UZ Workspace — робочий простір команди",
  description: "Проєкти, документи й задачі команд Укрзалізниці в одному просторі.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="uk"><body>{children}</body></html>;
}
