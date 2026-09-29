import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function BackButton({ label = "Back" }: { label?: string }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="mb-4 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-ink-0"
    >
      <ArrowLeft size={16} /> {label}
    </button>
  );
}
