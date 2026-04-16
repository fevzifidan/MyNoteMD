import React, { useEffect } from 'react';
import MarkdownEditor from './MarkdownEditor';
import MarkdownPreview from '../../../Note/shared/MarkdownPreview';
import { useEditor } from './EditorContext';
import { Button } from '@/components/ui/button';
import { ModeToggle, ModeToggleOption } from '@/shared/components/mode-toggle';
import { Eye, Edit3, Save, CheckCircle2, FileText, Cloud, CloudOff, Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

const EditorContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation('noteEditPage');
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

  const contentModeOptions: ModeToggleOption<'draft' | 'published'>[] = [
    { value: 'draft', icon: FileText, label: t('editor.draft') },
    { value: 'published', icon: CheckCircle2, label: t('editor.finalVersion') },
  ];

  const viewModeOptions: ModeToggleOption<'editor' | 'preview'>[] = [
    { value: 'editor', icon: Edit3, label: t('editor.editor') },
    { value: 'preview', icon: Eye, label: t('editor.preview') },
  ];

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
          <ModeToggle
            value={contentMode}
            onValueChange={setContentMode}
            options={contentModeOptions}
          />
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
                {isSavingDraft ? t('editor.saving') : hasUnsavedDraftChanges ? t('editor.unsaved') : t('editor.saved')}
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
              <span>{t('editor.saveAsFinalVersion')}</span>
            </Button>
          )}

          {/* Editor / Preview Toggle */}
          <div className="h-8 w-[1px] bg-border mx-2 hidden sm:block" />

          <ModeToggle
            value={viewMode}
            onValueChange={(value) => setViewMode(value)}
            options={viewModeOptions}
          />
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
