import { TopNav } from "@/features/navbar/top-right-nav";
import CommandPalette from "./layouts/CommandPalette";
import { Sidebar } from "@/components/custom/FloatingSidebar/FloatingSidebar";
import EditorContainer from "./layouts/Editor/EditorContainer";
import { EditorProvider } from "./layouts/Editor/EditorContext";

export default function NoteEditPage() {
  return (
    <EditorProvider>
      <div className="min-h-screen bg-background text-foreground">
        <TopNav collapse={true}/>
        <Sidebar />
        <main className="pt-24 lg:pt-32">
          <EditorContainer />
        </main>
        <CommandPalette />
      </div>
    </EditorProvider>
  );
}