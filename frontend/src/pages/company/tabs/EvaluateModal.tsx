import { useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { ErrorBanner } from "@/components/ui/Misc";
import { EvaluationApi } from "@/lib/resources";
import { extractError } from "@/lib/api";
import type { ApplicationResponse } from "@/lib/types";

function RatingInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-ink-1">{label}</p>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
              n <= value ? "bg-accent-500 text-surface-0" : "bg-surface-3 text-ink-2"
            }`}
          >
            {n}
          </button>
        ))}
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
  const [skillRating, setSkillRating] = useState(5);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await EvaluationApi.create(projectId, application.talentId, {
        professionalismRating,
        skillRating,
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
    <Modal title={`Evaluate ${application.talentName}`} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        {error && <ErrorBanner message={error} />}
        <RatingInput label="Professionalism" value={professionalismRating} onChange={setProfessionalismRating} />
        <RatingInput label="Skill" value={skillRating} onChange={setSkillRating} />
        <RatingInput label="Communication" value={communicationRating} onChange={setCommunicationRating} />
        <Textarea label="Feedback (optional)" value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Share feedback for the talent's passport..." />
        <p className="text-xs text-ink-3">Submitting creates a verified passport record for this talent.</p>
        <div className="flex gap-2">
          <Button type="submit" loading={submitting} className="flex-1">
            Submit evaluation
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
