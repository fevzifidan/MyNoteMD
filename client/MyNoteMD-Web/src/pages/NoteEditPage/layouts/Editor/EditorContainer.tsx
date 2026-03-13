import React from 'react';
import MarkdownEditor from './MarkdownEditor';
import MarkdownPreview from './MarkdownPreview';
import { useEditor } from './EditorContext';
import { Button } from '@/components/ui/button';
import { Eye, Edit3 } from 'lucide-react';

const EditorContainer: React.FC = () => {
  const { markdown, setMarkdown, deferredMarkdown, editorRef, viewMode, setViewMode } = useEditor();

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full lg:w-[85%] lg:max-w-none mx-auto px-0 sm:px-6 lg:px-8 py-4 gap-4 text-left">
      {/* View Toggle Bar */}
      <div className="flex justify-end gap-2 mb-2">
        <Button
          size="sm"
          variant={viewMode === 'editor' ? 'default' : 'outline'}
          onClick={() => setViewMode('editor')}
          className="rounded-full gap-2 px-4 shadow-sm"
        >
          <Edit3 className="h-4 w-4" />
          <span>Editor</span>
        </Button>
        <Button
          size="sm"
          variant={viewMode === 'preview' ? 'default' : 'outline'}
          onClick={() => setViewMode('preview')}
          className="rounded-full gap-2 px-4 shadow-sm"
        >
          <Eye className="h-4 w-4" />
          <span>Preview</span>
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        {viewMode === 'editor' ? (
          <MarkdownEditor
            markdown={markdown}
            setMarkdown={setMarkdown}
            editorRef={editorRef}
          />
        ) : (
          <div className="h-full border rounded-md p-6 overflow-y-auto bg-card text-card-foreground">
            <MarkdownPreview markdown={deferredMarkdown} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorContainer;
