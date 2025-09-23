import { Inter } from "next/font/google";
import { MuiThemeProvider } from "./components/MuiThemeProvider";
import { Metadata } from "next";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Professional Dashboard",
  description: "A professional notification management dashboard",
  keywords:
    "dashboard, notifications, appointments, schedules, users, admin, dashboard",
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MuiThemeProvider>{children}</MuiThemeProvider>
      </body>
    </html>
  );
}
