import { TopNav } from "@/features/navbar/top-right-nav";
import { Sidebar } from "@/components/custom/FloatingSidebar/FloatingSidebar";
import { EditorProvider, EditorContainer, CommandPalette } from "@/features/note-editor";

export default function NoteEditPage() {
  return (
    <EditorProvider>
      <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col">
        <Sidebar />
        
        {/* Sticky Header: Replaces fixed positioning to allow dynamic height adjustment */}
        <header className="sticky top-0 z-30 w-full pointer-events-none">
          <div className="relative w-full flex flex-col items-center pt-6 pb-4">
            {/* TopNav in absolute position within the header to stay in the corner */}
            <TopNav 
              collapse={true} 
              className="absolute top-6 right-6 pointer-events-auto" 
            />
            
            {/* CommandPalette in flow (static) to determine header height */}
            <CommandPalette 
              className="static translate-x-0 left-auto top-0 pointer-events-auto max-[1060px]:top-0" 
            />
          </div>
        </header>

        <main className="flex-1 transition-all duration-300">
          <EditorContainer />
        </main>
      </div>
    </EditorProvider>
  );
}