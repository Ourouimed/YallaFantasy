import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/providers/ReduxProvider";
import PopupModal from "@/components/ui/popup-modal";
import ToastList from "@/components/ui/toast-list";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "YallaFantsay | Play AFCON 2025 Fantsay now",
  description: "",
};

export default function RootLayout({ children }) {
  return (
  
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <PopupModal/>
          <ToastList/>
          {children}
        </ReduxProvider>
        
      </body>
    </html>
  );
}
