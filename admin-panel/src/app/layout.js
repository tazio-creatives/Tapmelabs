import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "TapMe Admin Panel",
  description: "Admin dashboard for TapMe NFC platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="h-full bg-slate-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
