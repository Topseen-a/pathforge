import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { Card, PageLoader } from "@/components/ui/Misc";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProjectSkillApi } from "@/lib/resources";
import type { ProjectSkillResponse } from "@/lib/types";
import { useToast } from "@/context/ToastContext";
import { extractError } from "@/lib/api";

export default function SkillsTab({ projectId }: { projectId: string }) {
  const [skills, setSkills] = useState<ProjectSkillResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState("");
  const { push } = useToast();

  const load = () => ProjectSkillApi.list(projectId).then(setSkills);

  useEffect(() => {
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const add = async () => {
    if (!newSkill.trim()) return;
    try {
      await ProjectSkillApi.add(projectId, { skillName: newSkill.trim() });
      setNewSkill("");
      await load();
    } catch (err) {
      push(extractError(err).message, "error");
    }
  };

  const remove = async (skillId: string) => {
    try {
      await ProjectSkillApi.remove(projectId, skillId);
      await load();
    } catch (err) {
      push(extractError(err).message, "error");
    }
  };

  if (loading) return <PageLoader />;

  return (
    <Card>
      <h2 className="mb-4 text-base font-semibold text-ink-0">Skills required</h2>
      <div className="mb-4 flex flex-wrap gap-2">
        {skills.map((s) => (
          <span key={s.skillId} className="flex items-center gap-1.5 rounded-full bg-surface-3 px-3 py-1.5 text-xs text-ink-1">
            {s.name}
            <button onClick={() => remove(s.skillId)} className="cursor-pointer text-ink-3 hover:text-red-400">
              <X size={12} />
            </button>
          </span>
        ))}
        {skills.length === 0 && <p className="text-sm text-ink-3">No skills added yet.</p>}
      </div>
      <div className="flex gap-2">
        <Input placeholder="Add a required skill" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} className="flex-1" />
        <Button type="button" variant="outline" onClick={add}>
          <Plus size={16} />
        </Button>
      </div>
    </Card>
  );
}
