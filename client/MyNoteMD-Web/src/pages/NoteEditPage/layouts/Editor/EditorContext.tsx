import React, { createContext, useContext, useRef, useState, useDeferredValue, useEffect } from 'react';
import type { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import apiService from '@/shared/services/api';

interface NoteData {
  id: string;
  content: string;
  publishedContent: string | null;
  hasUnpublishedChanges: boolean;
}

interface EditorContextType {
  markdown: string;
  setMarkdown: (val: string) => void;
  deferredMarkdown: string;
  applyFormat: (before: string, after?: string, isDirective?: boolean) => void;
  insertText: (snippet: string) => void;
  clearFormat: () => void;
  insertMath: (snippet: string) => void;
  editorRef: React.RefObject<ReactCodeMirrorRef | null>;
  viewMode: 'editor' | 'preview';
  setViewMode: (mode: 'editor' | 'preview') => void;
  // Note specific states
  contentMode: 'draft' | 'published';
  setContentMode: (mode: 'draft' | 'published') => void;
  noteData: NoteData | null;
  setNoteData: (data: NoteData | null) => void;
  isLoading: boolean;
  fetchNote: (id: string) => Promise<void>;
  publishNote: () => Promise<void>;
  // Auto-save states
  isSavingDraft: boolean;
  hasUnsavedDraftChanges: boolean;
  saveDraft: () => Promise<void>;
  lastSavedMarkdown: string;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [noteData, setNoteData] = useState<NoteData | null>(null);
  const [contentMode, setContentMode] = useState<'draft' | 'published'>('draft');
  const [markdown, setMarkdownState] = useState(``);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [lastSavedMarkdown, setLastSavedMarkdown] = useState('');
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const deferredMarkdown = useDeferredValue(markdown);
  const editorRef = useRef<ReactCodeMirrorRef>(null);

  const setMarkdown = (val: string) => {
    if (contentMode === 'draft') {
      setMarkdownState(val);
      if (noteData) {
        setNoteData({
          ...noteData,
          content: val,
          hasUnpublishedChanges: true // Assume changes if edited
        });
      }
    }
  };

  const fetchNote = async (id: string) => {
    setIsLoading(true);
    try {
      const res: any = await apiService.get(`/notes/${id}`);
      setNoteData(res);
      setMarkdownState(res.content || "");
      setLastSavedMarkdown(res.content || "");
    } catch (error: any) {
      console.error("Fetch Note Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveDraft = async () => {
    if (!noteData || isSavingDraft || markdown === lastSavedMarkdown) return;
    
    setIsSavingDraft(true);
    try {
      await apiService.patch(`/notes/${noteData.id}`, { content: markdown }, { silent: true } as any);
      setLastSavedMarkdown(markdown);
      setNoteData(prev => prev ? { ...prev, content: markdown } : null);
    } catch (error: any) {
      console.error("Auto-save Error:", error);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const hasUnsavedDraftChanges = markdown !== lastSavedMarkdown;

  useEffect(() => {
    if (contentMode !== 'draft' || !noteData) return;
    
    if (hasUnsavedDraftChanges) {
      const timer = setTimeout(() => {
        saveDraft();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [markdown, lastSavedMarkdown, contentMode, noteData, isSavingDraft]);

  const publishNote = async () => {
    if (!noteData) return;
    try {
      await apiService.post(`/notes/${noteData.id}/publish`, {});
      setNoteData({
        ...noteData,
        publishedContent: noteData.content,
        hasUnpublishedChanges: false
      });
    } catch (error: any) {
      console.error("Publish Note Error:", error);
    }
  };

  useEffect(() => {
    if (contentMode === 'published' && noteData) {
      setMarkdownState(noteData.publishedContent || "");
    } else if (contentMode === 'draft' && noteData) {
      setMarkdownState(noteData.content || "");
    }
  }, [contentMode, noteData?.content, noteData?.publishedContent]);

  const getView = () => editorRef.current?.view;
  // ... (rest of the formatting methods remain unchanged, omitting for brevity in TargetContent matching)

  const mergeStyleProps = (oldProps: string, newProps: string) => {
    const propsObj: Record<string, string> = {};
    const regex = /([a-zA-Z0-9_-]+)(?:=([^ \s{}]+))?/g;
    let m;
    while ((m = regex.exec(oldProps)) !== null) {
      propsObj[m[1]] = m[2] || "true";
    }
    while ((m = regex.exec(newProps)) !== null) {
      propsObj[m[1]] = m[2] || "true";
    }
    return Object.entries(propsObj)
      .map(([k, v]) => (v === "true" ? k : `${k}=${v}`))
      .join(" ");
  };

  const applyFormat = (before: string, after = "", isDirective = false) => {
    const view = getView();
    if (!view) return;

    const { from, to } = view.state.selection.main;
    const fullText = view.state.doc.toString();

    if (isDirective) {
      const textBefore = fullText.substring(0, from);
      const lastOpenIndex = textBefore.lastIndexOf(":style[");

      if (lastOpenIndex !== -1) {
        const contentEndIndex = fullText.indexOf("]{", lastOpenIndex);
        const propsEndIndex = fullText.indexOf("}", contentEndIndex);

        if (contentEndIndex !== -1 && propsEndIndex !== -1 && from <= propsEndIndex) {
          const existingContent = fullText.substring(lastOpenIndex + 7, contentEndIndex);
          const existingPropsStr = fullText.substring(contentEndIndex + 2, propsEndIndex);

          const newPropsMatch = after.match(/\{(.*?)\}/);
          const newPropsStr = newPropsMatch ? newPropsMatch[1] : "";

          const mergedProps = mergeStyleProps(existingPropsStr, newPropsStr);
          const replacement = `:style[${existingContent}]{${mergedProps}}`;

          view.dispatch({
            changes: { from: lastOpenIndex, to: propsEndIndex + 1, insert: replacement },
            selection: { anchor: lastOpenIndex + replacement.length }
          });
          view.focus();
          return;
        }
      }
    }

    const selectedText = view.state.sliceDoc(from, to);
    const replacement = `${before}${selectedText}${after}`;

    const newCursorPos = selectedText.length > 0
      ? from + replacement.length
      : from + before.length;

    view.dispatch({
      changes: { from, to, insert: replacement },
      selection: { anchor: newCursorPos }
    });
    view.focus();
  };

  const insertText = (snippet: string) => {
    const view = getView();
    if (!view) return;

    const { from, to } = view.state.selection.main;

    view.dispatch({
      changes: { from, to, insert: snippet },
      selection: { anchor: from + snippet.length }
    });
    view.focus();
  };

  const clearFormat = () => {
    const view = getView();
    if (!view) return;

    const { from, to } = view.state.selection.main;
    const selectedText = view.state.sliceDoc(from, to);
    const cleaned = selectedText.replace(/(\*\*|__|\*|_|~~|==|:style\[|\]\{.*?\})/g, "");

    view.dispatch({
      changes: { from, to, insert: cleaned },
      selection: { anchor: from + cleaned.length }
    });
    view.focus();
  };

  const insertMath = (snippet: string) => {
    const view = getView();
    if (!view) return;

    const { from, to } = view.state.selection.main;
    const fullText = view.state.doc.toString();

    const beforeText = fullText.substring(0, from);

    const doubleDollarCount = (beforeText.match(/\$\$/g) || []).length;
    const isInsideBlock = doubleDollarCount % 2 !== 0;

    const singleDollarCount = (beforeText.replace(/\$\$/g, "").match(/\$/g) || []).length;
    const isInsideInline = singleDollarCount % 2 !== 0;

    const isInsideMath = isInsideBlock || isInsideInline;
    const cleanSnippet = snippet.replace(/(^\$+)|(\$+$)/g, "").trim();

    let finalSnippet = cleanSnippet;

    if (!isInsideMath) {
      const isInline = snippet.startsWith('$') && !snippet.startsWith('$$') && !snippet.includes('\n');
      if (isInline) {
        finalSnippet = `$${cleanSnippet}$`;
      } else {
        // finalSnippet = `\n$$\n${cleanSnippet}\n$$\n`;
        finalSnippet = `$${cleanSnippet}$`;
      }
    }

    view.dispatch({
      changes: { from, to, insert: finalSnippet },
      selection: { anchor: from + finalSnippet.length }
    });
    view.focus();
  };

  return (
    <EditorContext.Provider
      value={{
        markdown,
        setMarkdown,
        deferredMarkdown,
        applyFormat,
        insertText,
        clearFormat,
        insertMath,
        editorRef,
        viewMode,
        setViewMode,
        contentMode,
        setContentMode,
        noteData,
        setNoteData,
        isLoading,
        fetchNote,
        publishNote,
        isSavingDraft,
        hasUnsavedDraftChanges,
        saveDraft,
        lastSavedMarkdown
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
