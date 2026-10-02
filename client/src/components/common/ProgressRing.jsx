import React from 'react';

export default function ProgressRing({
  progress = 0,
  size = 180,
  strokeWidth = 14,
  label = 'Overall Cut',
  sublabel = 'Completion',
  color = '#38bdf8', // cyan
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(Math.max(progress, 0), 100) / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1a1a1a"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            transition: 'stroke-dashoffset 1s ease-in-out',
            filter: 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.4))',
          }}
        />
      </svg>

      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
          {progress.toFixed(1)}%
        </span>
        <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider mt-0.5">
          {label}
        </span>
        {sublabel && (
          <span className="text-[10px] text-neutral-400 font-mono">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
