import { FC } from 'react';

interface QuoteHighlightProps {
  text: string;
}

export const QuoteHighlight: FC<QuoteHighlightProps> = ({ text }) => {
  return (
    <div className="w-full bg-yellow-100/30 px-4 py-1.5 rounded text-center relative">
      <svg
        className="absolute -left-1 -top-1.5 w-4 h-4 text-yellow-200"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M9.5,3C5.36,3 2,6.36 2,10.5C2,14.64 5.36,18 9.5,18H11V21H8V18.5C4.86,17.45 2.34,14.24 2,10.5C2,6.36 5.36,3 9.5,3M9.5,5C6.46,5 4,7.46 4,10.5C4,13.54 6.46,16 9.5,16H11V5H9.5Z" />
      </svg>
      <span className="text-xs font-medium px-2">
        {text.slice(0, 10)}
      </span>
      <svg
        className="absolute -right-1 -top-1.5 w-4 h-4 text-yellow-200 transform rotate-180"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M9.5,3C5.36,3 2,6.36 2,10.5C2,14.64 5.36,18 9.5,18H11V21H8V18.5C4.86,17.45 2.34,14.24 2,10.5C2,6.36 5.36,3 9.5,3M9.5,5C6.46,5 4,7.46 4,10.5C4,13.54 6.46,16 9.5,16H11V5H9.5Z" />
      </svg>
    </div>
  );
};

export default QuoteHighlight; 