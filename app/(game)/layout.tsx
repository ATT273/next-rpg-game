import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '@/styles.css';
import LeftSideBar from "@/components/layouts/leftside-bar";
import RightSideBar from "@/components/layouts/rightside-bar";

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
    <div className="w-full h-full">
      <LeftSideBar />
      <RightSideBar />
      {children}
    </div>
  );
}
