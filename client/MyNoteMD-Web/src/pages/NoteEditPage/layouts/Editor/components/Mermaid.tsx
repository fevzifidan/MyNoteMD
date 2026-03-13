import React, { useRef, useEffect } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
});

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && chart) {
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      mermaid.render(id, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      }).catch((err) => {
        console.error("Mermaid Render Hatası:", err);
      });
    }
  }, [chart]);

  return (
    <div 
      key={chart} 
      ref={ref} 
      style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }} 
    />
  );
};

export default Mermaid;
