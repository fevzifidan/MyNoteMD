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
}

const latexExtension = StreamLanguage.define(stex);

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ markdown, setMarkdown, editorRef }) => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="h-full border rounded-md overflow-hidden bg-background">
      <CodeMirror
        ref={editorRef}
        value={markdown}
        height="100%"
        theme={resolvedTheme === 'dark' ? vscodeDark : 'light'}
        onChange={(val) => setMarkdown(val)}
        extensions={[
          cmMarkdown({ base: markdownLanguage, codeLanguages: languages }),
          latexExtension,
          EditorView.lineWrapping
        ]}
        basicSetup={{
          lineNumbers: true,
          history: true,
          foldGutter: false,
          highlightActiveLine: true,
          bracketMatching: true,
        }}
        className="text-xs sm:text-xs font-thin font-mono h-full"
      />
    </div>
  );
};

export default MarkdownEditor;
