import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "FieldTrack – GPS-Verified Trainee Attendance",
  description:
    "A location-aware attendance system that uses GPS geofencing to verify trainee officer presence at training sites in real time.",
  keywords: ["attendance", "geofencing", "GPS", "GIS", "training", "FieldTrack"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-emerald-50/30 text-emerald-950">{children}</body>
    </html>
  );
}
