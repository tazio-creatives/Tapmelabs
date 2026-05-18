import { Inter, Plus_Jakarta_Sans, Figtree } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

export const metadata = {
  title: "TapMe Lab | NFC Business Card",
  description:
    "Create smart NFC business cards and digital profiles with TapMe Lab.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jakarta.variable} ${figtree.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}