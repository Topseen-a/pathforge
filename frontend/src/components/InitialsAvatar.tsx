import { clsx } from "clsx";

export function InitialsAvatar({
  initials,
  bg = "bg-accent-500/25",
  fg = "text-accent-200",
  className,
}: {
  initials: string;
  bg?: string;
  fg?: string;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
        bg,
        fg,
        className
      )}
    >
      {initials}
    </div>
  );
}
