import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkGithubAlerts from 'remark-github-alerts';
import 'remark-github-alerts/styles/github-colors-light.css';
import 'remark-github-alerts/styles/github-colors-dark-class.css';
import 'remark-github-alerts/styles/github-base.css';
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
    code({ node, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      const isBlock = !!match;

      if (language === 'mermaid') {
        return <Mermaid chart={String(children).replace(/\n$/, '')} />;
      }

      return isBlock ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match![1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code
          className="bg-muted px-1 py-0.5 rounded text-xs font-mono"
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
        remarkPlugins={[remarkGfm, remarkMath, remarkDirective, customDirectivePlugin, remarkGithubAlerts]}
        rehypePlugins={[
          rehypeRaw,
          rehypeKatex,
          [rehypeSanitize, {
            ...defaultSchema,
            attributes: {
              ...defaultSchema.attributes,
              // Allow KaTeX and syntax highlighter classes
              '*': [...(defaultSchema.attributes?.['*'] ?? []), 'className', 'style'],
              // Allow img src, alt, width, height
              'img': ['src', 'alt', 'width', 'height', 'title'],
            },
            // Explicitly reject script and iframe tags
            tagNames: (defaultSchema.tagNames ?? []).filter(
              (tag) => !['script', 'iframe', 'object', 'embed'].includes(tag)
            ),
          }],
        ]}
        components={components}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;
