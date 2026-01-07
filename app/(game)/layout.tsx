import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/public/styles.css";
import LeftSideBar from "@/components/layouts/leftside-bar";
import RightSideBar from "@/components/layouts/rightside-bar";
import { Toaster } from "sonner";

// import ThemeSong from "@/public/music/dungeon_theme_ost.mp3";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next RPG Game",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full px-100">
      <Toaster richColors position="top-center" />
      <LeftSideBar />
      <RightSideBar />
      <div className="h-full">{children}</div>
    </div>
  );
}
