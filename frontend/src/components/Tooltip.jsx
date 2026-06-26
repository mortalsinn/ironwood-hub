import React from 'react';
import { Info } from 'lucide-react';

export default function Tooltip({ text, children }) {
  return (
    <div className="relative flex items-center group cursor-help">
      {children}
      {text && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
          <div className="font-medium">{text}</div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
        </div>
      )}
    </div>
  );
}
