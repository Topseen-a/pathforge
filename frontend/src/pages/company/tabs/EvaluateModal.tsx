import { useState, type FormEvent } from "react";
import { Star } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { ErrorBanner } from "@/components/ui/Misc";
import { EvaluationApi } from "@/lib/resources";
import { extractError } from "@/lib/api";
import type { ApplicationResponse } from "@/lib/types";

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very good",
  5: "Excellent",
};

function RatingRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const shown = hovered || value;

  return (
    <div className="flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium text-ink-1">{label}</p>
      <div className="flex items-center gap-3">
        <span className="text-xs text-ink-3">{RATING_LABELS[shown] ?? ""}</span>
        <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              onMouseEnter={() => setHovered(n)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              className="cursor-pointer p-0.5 text-accent-500 transition-transform hover:scale-110"
            >
              <Star size={20} fill={n <= shown ? "currentColor" : "none"} strokeWidth={1.75} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EvaluateModal({
  projectId,
  application,
  onClose,
  onDone,
}: {
  projectId: string;
  application: ApplicationResponse;
  onClose: () => void;
  onDone: () => void;
}) {
  const [professionalismRating, setProfessionalismRating] = useState(5);
  const [qualityRating, setQualityRating] = useState(5);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const overallRating = Math.round(((professionalismRating + qualityRating + communicationRating) / 3) * 10) / 10;
      await EvaluationApi.create(projectId, application.talentId, {
        overallRating,
        professionalismRating,
        qualityRating,
        communicationRating,
        feedback: feedback || undefined,
      });
      onDone();
    } catch (err) {
      setError(extractError(err).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={`Evaluate ${application.talentName}`}
      onClose={onClose}
      footer={
        <div className="space-y-3">
          <p className="text-xs text-ink-3">Submitting creates a verified passport record for this talent.</p>
          <div className="flex gap-2">
            <Button type="submit" form="evaluate-form" loading={submitting} className="flex-1">
              Submit evaluation
            </Button>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      }
    >
      <form id="evaluate-form" onSubmit={onSubmit} className="space-y-4">
        {error && <ErrorBanner message={error} />}
        <div className="divide-y divide-surface-border rounded-2xl border border-surface-border bg-surface-2">
          <RatingRow label="Professionalism" value={professionalismRating} onChange={setProfessionalismRating} />
          <RatingRow label="Skill" value={qualityRating} onChange={setQualityRating} />
          <RatingRow label="Communication" value={communicationRating} onChange={setCommunicationRating} />
        </div>
        <Textarea label="Feedback (optional)" value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Share feedback for the talent's passport..." />
      </form>
    </Modal>
  );
}
