import { visit } from 'unist-util-visit';

const KNOWN_DIRECTIVES = ['style', 'video', 'audio'];

export function customDirectivePlugin() {
  return (tree: any) => {
    visit(tree, (node) => {
      if (['textDirective', 'leafDirective', 'containerDirective'].includes(node.type)) {
        const data = node.data || (node.data = {});
        const attributes = node.attributes || {};

        if (node.name === 'style') {
          data.hName = 'markdown-style';
          data.hProperties = {
            ...attributes
          };
          return;
        }

        if (node.name === 'video') {
          data.hName = 'video';
          data.hProperties = { src: attributes.url || attributes.src, controls: true, style: { maxWidth: '100%' } };
          return;
        }

        if (node.name === 'audio') {
          data.hName = 'audio';
          data.hProperties = { src: attributes.url || attributes.src, controls: true };
          return;
        }

        // Unrecognized directive — convert back to plain text to prevent
        // the content from being silently dropped and corrupting surrounding
        // bold/italic/code markers in the document.
        if (!KNOWN_DIRECTIVES.includes(node.name) && node.type === 'textDirective') {
          const innerText = (node.children ?? [])
            .map((c: any) => c.value ?? (c.children ?? []).map((cc: any) => cc.value ?? '').join(''))
            .join('');

          node.type = 'text';
          node.value = `:${node.name}${innerText ? `[${innerText}]` : ''}`;
          delete node.children;
          delete node.data;
        }
      }
    });
  };
}
