import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/public/styles.css";
import LeftSideBar from "@/components/layouts/LeftSizebar";
import RightSideBar from "@/components/layouts/RightSizebar";
import { Toaster } from "sonner";
import UIProvider from "./_components/UIProvider";
import TopMenu from "./_components/TopMenu";

// import ThemeSong from "@/public/music/dungeon_theme_ost.mp3";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next RPG Game",
  description: "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <div className="w-full h-full overflow-x-hidden">
        <Toaster richColors position="top-center" />
        <TopMenu />
        <div className="flex-1 h-full">{children}</div>
      </div>
    </UIProvider>
  );
}
