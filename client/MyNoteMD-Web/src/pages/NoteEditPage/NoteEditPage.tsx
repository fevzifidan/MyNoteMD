import { NoteEditNavbar } from "@/features/navbar/note-edit-navbar";
import { EditorProvider, EditorContainer } from "@/features/note-editor";

export default function NoteEditPage() {
  return (
    <EditorProvider>
      <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col">
        <NoteEditNavbar />

        <main className="flex-1 transition-all duration-300 max-[1060px]:px-6 max-[1060px]:pt-4">
          <EditorContainer />
        </main>
      </div>
    </EditorProvider>
  );
}