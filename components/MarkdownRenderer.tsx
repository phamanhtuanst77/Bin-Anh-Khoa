
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-slate max-w-none 
      prose-headings:font-quicksand prose-headings:font-bold 
      prose-p:leading-relaxed prose-strong:text-indigo-700
      prose-li:my-1 prose-pre:bg-slate-800 prose-pre:text-slate-100">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-2xl mt-6 mb-4 text-indigo-800 border-b-2 border-indigo-100 pb-2" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-xl mt-5 mb-3 text-indigo-700 font-semibold flex items-center gap-2" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-lg mt-4 mb-2 text-indigo-600 font-semibold" {...props} />,
          p: ({node, ...props}) => <p className="mb-4 text-slate-700 whitespace-pre-wrap" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
          li: ({node, ...props}) => <li className="text-slate-700" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-amber-400 bg-amber-50 p-4 my-4 italic rounded-r-lg" {...props} />,
          strong: ({node, ...props}) => <strong className="font-bold text-indigo-800" {...props} />,
          code: ({node, inline, className, children, ...props}: any) => {
            return inline ? (
              <code className="bg-slate-200 text-pink-600 px-1 rounded font-mono text-sm" {...props}>
                {children}
              </code>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
