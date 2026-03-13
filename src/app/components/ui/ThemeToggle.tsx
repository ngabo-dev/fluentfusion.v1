import { useTheme } from '../../../context/ThemeContext';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  // Dark theme only - no toggle needed
  return (
    <div
      className={`flex items-center justify-center h-8 px-1 rounded-full border ${className}`}
      style={{
        background: 'var(--bg-tertiary)',
        borderColor: 'var(--border-default)',
        minWidth: '40px',
      }}
      title="Dark mode"
    >
      {/* Moon icon - always active since we only have dark theme */}
      <span
        className="w-6 h-6 flex items-center justify-center rounded-full text-[13px]"
        style={{
          background: 'var(--accent-primary)',
          color: 'var(--text-inverse)',
        }}
      >
        🌙
      </span>
    </div>
  );
}
