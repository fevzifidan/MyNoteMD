import { visit } from 'unist-util-visit';

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
        }

        if (node.name === 'video') {
          data.hName = 'video';
          data.hProperties = { src: attributes.url || attributes.src, controls: true, style: { maxWidth: '100%' } };
        }
        if (node.name === 'audio') {
          data.hName = 'audio';
          data.hProperties = { src: attributes.url || attributes.src, controls: true };
        }
      }
    });
  };
}
