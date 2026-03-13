import { visit } from 'unist-util-visit';

export function customDirectivePlugin() {
  return (tree: any) => {
    visit(tree, (node) => {
      if (['textDirective', 'leafDirective', 'containerDirective'].includes(node.type)) {
        const data = node.data || (node.data = {});
        const attributes = node.attributes || {};
        
        if (node.name === 'style') {
          data.hName = attributes.block ? 'div' : 'span';
          data.hProperties = {
            style: {
              color: attributes.color,
              backgroundColor: attributes.bg,
              fontSize: attributes.size,
              fontFamily: attributes.font,
              textAlign: attributes.align,
              textDecoration: attributes.underline ? 'underline' : attributes.strike ? 'line-through' : undefined,
              lineHeight: attributes.lh,
              padding: attributes.p,
              margin: attributes.m,
              direction: attributes.rtl ? 'rtl' : 'ltr',
              display: attributes.align ? 'block' : 'inline-block'
            }
          };
        }

        if (node.name === 'video') {
          data.hName = 'video';
          data.hProperties = { src: attributes.url, controls: true, style: { maxWidth: '100%' } };
        }
        if (node.name === 'audio') {
          data.hName = 'audio';
          data.hProperties = { src: attributes.url, controls: true };
        }
      }
    });
  };
}
