import { TopNav } from "@/features/navbar/top-right-nav";
import CommandPalette from "./layouts/CommandPalette";
import { Sidebar } from "@/components/custom/FloatingSidebar/FloatingSidebar";

export default function NoteEditPage() {
  return (
    <>
        <TopNav />
        <Sidebar />
        <CommandPalette />
    </>
  );
}