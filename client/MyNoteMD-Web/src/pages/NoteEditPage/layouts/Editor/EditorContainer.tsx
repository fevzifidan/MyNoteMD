import React, { useEffect } from 'react';
import MarkdownEditor from './MarkdownEditor';
import MarkdownPreview from '../../../Note/shared/MarkdownPreview';
import { useEditor } from './EditorContext';
import { Button } from '@/components/ui/button';
import { Eye, Edit3, Save, CheckCircle2, History, Cloud, CloudOff, Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const EditorContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    markdown,
    setMarkdown,
    deferredMarkdown,
    editorRef,
    viewMode,
    setViewMode,
    contentMode,
    setContentMode,
    noteData,
    isLoading,
    fetchNote,
    publishNote,
    isSavingDraft,
    hasUnsavedDraftChanges,
    saveDraft
  } = useEditor();

  useEffect(() => {
    if (id) {
      fetchNote(id);
    }
  }, [id]);

  const handlePublish = async () => {
    await publishNote();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-[calc(100vh-80px)] w-full lg:w-[85%] lg:max-w-none mx-auto px-0 sm:px-6 lg:px-8 py-4 gap-4">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-48" />
        </div>
        <Skeleton className="flex-1 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full lg:w-[85%] lg:max-w-none mx-auto px-0 sm:px-6 lg:px-8 py-4 gap-4 text-left">
      {/* View Toggle & Content Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <div className="flex gap-2">
          {/* Draft / Final Version Toggle */}
          <Button
            size="sm"
            variant={contentMode === 'draft' ? 'default' : 'outline'}
            onClick={() => setContentMode('draft')}
            className="rounded-full gap-2 px-4 shadow-sm"
          >
            <History className="h-4 w-4" />
            <span>Draft</span>
          </Button>
          <Button
            size="sm"
            variant={contentMode === 'published' ? 'default' : 'outline'}
            onClick={() => setContentMode('published')}
            className="rounded-full gap-2 px-4 shadow-sm"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Final Version</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto-Save Draft Button */}
          {contentMode === 'draft' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={saveDraft}
              disabled={isSavingDraft || !hasUnsavedDraftChanges}
              className={`rounded-full gap-2 px-3 text-sm flex ${
                hasUnsavedDraftChanges ? "text-amber-500 hover:text-amber-600 hover:bg-amber-50" : "text-muted-foreground"
              }`}
            >
              {isSavingDraft ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : hasUnsavedDraftChanges ? (
                <CloudOff className="h-4 w-4" />
              ) : (
                <Cloud className="h-4 w-4 text-green-500" />
              )}
              <span className="hidden sm:inline">
                {isSavingDraft ? 'Saving...' : hasUnsavedDraftChanges ? 'Unsaved' : 'Saved'}
              </span>
            </Button>
          )}

          {/* Save as Final Version Button */}
          {contentMode === 'draft' && noteData?.hasUnpublishedChanges && (
            <Button
              size="sm"
              variant="secondary"
              onClick={handlePublish}
              className="rounded-full gap-2 px-4 shadow-sm bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="h-4 w-4" />
              <span>Save as Final Version</span>
            </Button>
          )}

          {/* Editor / Preview Toggle */}
          <div className="h-8 w-[1px] bg-border mx-2 hidden sm:block" />

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
      </div>

      <div className="flex-1 overflow-hidden">
        {viewMode === 'editor' ? (
          <MarkdownEditor
            markdown={markdown}
            setMarkdown={setMarkdown}
            editorRef={editorRef}
            readOnly={contentMode === 'published'}
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
