import React from 'react';
import CodeMirror, { type ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { markdown as cmMarkdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { StreamLanguage } from '@codemirror/language';
import { stex } from '@codemirror/legacy-modes/mode/stex';
import { EditorView } from '@codemirror/view';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { useTheme } from 'next-themes';

interface MarkdownEditorProps {
  markdown: string;
  setMarkdown: (val: string) => void;
  editorRef: React.RefObject<ReactCodeMirrorRef | null>;
  readOnly?: boolean;
}

const latexExtension = StreamLanguage.define(stex);

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ markdown, setMarkdown, editorRef, readOnly = false }) => {
  const { resolvedTheme } = useTheme();

  const extensions = React.useMemo(() => [
    cmMarkdown({ base: markdownLanguage, codeLanguages: languages }),
    latexExtension,
    EditorView.lineWrapping
  ], []);

  const basicSetup = React.useMemo(() => ({
    lineNumbers: true,
    history: true,
    foldGutter: false,
    highlightActiveLine: !readOnly,
    bracketMatching: true,
  }), [readOnly]);

  return (
    <div className="h-full border rounded-md overflow-hidden bg-background">
      <CodeMirror
        ref={editorRef}
        value={markdown}
        height="100%"
        theme={resolvedTheme === 'dark' ? vscodeDark : 'light'}
        onChange={(val) => !readOnly && setMarkdown(val)}
        readOnly={readOnly}
        extensions={extensions}
        basicSetup={basicSetup}
        className="text-xs sm:text-xs font-thin font-mono h-full"
      />
    </div>
  );
};

export default MarkdownEditor;
