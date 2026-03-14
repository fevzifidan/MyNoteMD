import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import { customDirectivePlugin } from './plugins/customDirectivePlugin';
import Mermaid from './components/Mermaid';
import { useTheme } from 'next-themes';

interface MarkdownPreviewProps {
  markdown: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ markdown }) => {
  const { resolvedTheme } = useTheme();

  const components = useMemo(() => ({
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';

      if (language === 'mermaid') {
        return <Mermaid chart={String(children).replace(/\n$/, '')} />;
      }

      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code
          className="bg-muted px-1 py-0.5 rounded text-xs-[8px] font-mono"
          {...props}
        >
          {children}
        </code>
      );
    },
    td: ({ node, children, ...props }: any) => {
      const content = children?.[0];
      if (typeof content === 'string' && content.startsWith('$rowspan=')) {
        const parts = content.split('$');
        const span = parts[1].split('=')[1];
        return <td rowSpan={parseInt(span)} {...props}>{parts[2]}</td>;
      }
      return <td {...props}>{children}</td>;
    }
  }), []);

  return (
    <div className={`prose prose-sm max-w-none dark:prose-invert text-[13px] text-sm-[12px] leading-relaxed overflow-x-hidden ${resolvedTheme === 'dark' ? 'dark' : ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkDirective, customDirectivePlugin]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;
