import { FC } from 'react';

interface QuoteHighlightProps {
  text: string;
}

export const QuoteHighlight: FC<QuoteHighlightProps> = ({ text }) => {
  return (
    <div className="w-full bg-yellow-100/30 px-4 py-1.5 rounded text-center">
      <span className="text-xs font-medium relative">
        <span className="text-yellow-200 absolute -left-3 -top-1">&quot;</span>
        {text.slice(0, 10)}
        <span className="text-yellow-200 absolute -right-3 -top-1">&quot;</span>
      </span>
    </div>
  );
};

export default QuoteHighlight; 