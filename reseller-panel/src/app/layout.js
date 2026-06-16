import "./globals.css";

export const metadata = {
  title: "TapMe Labs — Reseller Panel",
  description: "Reseller dashboard for TapMe Labs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
