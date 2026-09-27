export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#9ac21e" />
      <path d="M7.5 23.5C9 15.5 15 9.5 24 8" stroke="#12241a" strokeWidth="3.1" strokeLinecap="round" />
      <circle cx="7.5" cy="23.5" r="2.3" fill="#12241a" />
      <circle cx="24.2" cy="8" r="3" fill="#12241a" />
    </svg>
  );
}
