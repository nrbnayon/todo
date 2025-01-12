import "./globals.css";
import { Geist, Geist_Mono, Questrial, Rubik } from "next/font/google";
import { ReduxProvider } from "@/redux/provider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const questrial = Questrial({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-questrial",
});

const rubik = Rubik({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-rubik",
});

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${questrial.variable} ${rubik.variable} fallback-font antialiased`}
      >
        <ReduxProvider>
            {children}
        </ReduxProvider>
        <Toaster position='top-center' />
      </body>
    </html>
  );
}
