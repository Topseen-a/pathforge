import { useEffect, useState, type ReactNode } from "react";
import { clsx } from "clsx";

export function PageTransition({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    setVisible(false);
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={clsx("transition-all duration-300 ease-out", visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0")}>
      {children}
    </div>
  );
}
