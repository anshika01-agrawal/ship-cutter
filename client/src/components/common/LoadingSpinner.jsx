import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Acquiring telemetry...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3">
      <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
      <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">{text}</span>
    </div>
  );
}
