import type {
  ApplicantProfile,
  ApplicantProfileInput,
  ApplicantProfileTone,
} from "@searchparty/shared";
import type { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type ProfileDraft = ApplicantProfileInput;

type DraftListKey =
  | "workExperiences"
  | "skills"
  | "projects";

export const emptyProfileDraft: ProfileDraft = {
  name: "",
  targetRole: "",
  summary: "",
  preferredTone: "professional",
  workExperiences: [],
  skills: [],
  projects: [],
};

interface ProfileEditorProps {
  draft: ProfileDraft;
  setDraft: Dispatch<SetStateAction<ProfileDraft>>;
}

export function ProfileEditor({
  draft,
  setDraft,
}: ProfileEditorProps) {
  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <section className="grid gap-3">
        <label className="grid gap-1 text-xs font-semibold">
          Profile name
          <Input
            value={draft.name}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
            placeholder="Customer service profile"
          />
        </label>
        <label className="grid gap-1 text-xs font-semibold">
          Target role
          <Input
            value={draft.targetRole}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                targetRole: event.target.value,
              }))
            }
            placeholder="Customer Service Representative"
          />
        </label>
        <label className="grid gap-1 text-xs font-semibold">
          Preferred tone
          <select
            className="flex h-9 w-full rounded-[10px] border border-input bg-input/10 px-3.5 py-2 text-sm focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
            value={draft.preferredTone}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                preferredTone: event.target
                  .value as ApplicantProfileTone,
              }))
            }
          >
            <option value="professional">Professional</option>
            <option value="confident">Confident</option>
            <option value="friendly">Friendly</option>
          </select>
        </label>
        <label className="grid gap-1 text-xs font-semibold">
          Summary
          <textarea
            className="min-h-24 rounded-[10px] border border-input bg-input/10 px-3.5 py-2 text-sm focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
            value={draft.summary}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                summary: event.target.value,
              }))
            }
            placeholder="What should applications emphasize for this profile?"
          />
        </label>
      </section>

      <WorkExperienceEditor draft={draft} setDraft={setDraft} />
      <SkillEditor draft={draft} setDraft={setDraft} />
      <ProjectEditor draft={draft} setDraft={setDraft} />
    </form>
  );
}

function WorkExperienceEditor({
  draft,
  setDraft,
}: ProfileEditorProps) {
  return (
    <EditorSection
      title="Work history"
      emptyText="Add work history to help SearchParty answer experience questions."
      onAdd={() =>
        setDraft((current) => ({
          ...current,
          workExperiences: [
            ...current.workExperiences,
            {
              company: "",
              title: "",
              startDate: "",
              endDate: "",
              description: "",
              technologies: [],
              achievements: [],
            },
          ],
        }))
      }
    >
      {draft.workExperiences.map((experience, index) => (
        <div
          key={index}
          className="grid gap-2 rounded-xl border border-border bg-card/50 p-3"
        >
          <Input
            value={experience.company}
            placeholder="Company"
            onChange={(event) =>
              updateDraftItem(setDraft, "workExperiences", index, {
                company: event.target.value,
              })
            }
          />
          <Input
            value={experience.title}
            placeholder="Title"
            onChange={(event) =>
              updateDraftItem(setDraft, "workExperiences", index, {
                title: event.target.value,
              })
            }
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={experience.startDate}
              placeholder="Start"
              onChange={(event) =>
                updateDraftItem(
                  setDraft,
                  "workExperiences",
                  index,
                  { startDate: event.target.value }
                )
              }
            />
            <Input
              value={experience.endDate}
              placeholder="End"
              onChange={(event) =>
                updateDraftItem(
                  setDraft,
                  "workExperiences",
                  index,
                  { endDate: event.target.value }
                )
              }
            />
          </div>
          <textarea
            className="min-h-20 rounded-[10px] border border-input bg-input/10 px-3.5 py-2 text-sm focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
            value={experience.description}
            placeholder="Role description"
            onChange={(event) =>
              updateDraftItem(setDraft, "workExperiences", index, {
                description: event.target.value,
              })
            }
          />
          <Input
            value={joinList(experience.technologies)}
            placeholder="Tools or tech, comma separated"
            onChange={(event) =>
              updateDraftItem(setDraft, "workExperiences", index, {
                technologies: splitList(event.target.value),
              })
            }
          />
          <Input
            value={joinList(experience.achievements)}
            placeholder="Achievements, comma separated"
            onChange={(event) =>
              updateDraftItem(setDraft, "workExperiences", index, {
                achievements: splitList(event.target.value),
              })
            }
          />
          <RemoveButton
            onClick={() =>
              removeDraftItem(setDraft, "workExperiences", index)
            }
          />
        </div>
      ))}
    </EditorSection>
  );
}

function SkillEditor({ draft, setDraft }: ProfileEditorProps) {
  return (
    <EditorSection
      title="Skills"
      emptyText="Add skills that should be reused during applications."
      onAdd={() =>
        setDraft((current) => ({
          ...current,
          skills: [
            ...current.skills,
            {
              name: "",
              category: "",
              yearsOfExperience: 0,
            },
          ],
        }))
      }
    >
      {draft.skills.map((skill, index) => (
        <div
          key={index}
          className="grid gap-2 rounded-xl border border-border bg-card/50 p-3"
        >
          <Input
            value={skill.name}
            placeholder="Skill"
            onChange={(event) =>
              updateDraftItem(setDraft, "skills", index, {
                name: event.target.value,
              })
            }
          />
          <Input
            value={skill.category}
            placeholder="Category"
            onChange={(event) =>
              updateDraftItem(setDraft, "skills", index, {
                category: event.target.value,
              })
            }
          />
          <Input
            type="number"
            min={0}
            value={skill.yearsOfExperience}
            placeholder="Years"
            onChange={(event) =>
              updateDraftItem(setDraft, "skills", index, {
                yearsOfExperience: Number(event.target.value),
              })
            }
          />
          <RemoveButton
            onClick={() =>
              removeDraftItem(setDraft, "skills", index)
            }
          />
        </div>
      ))}
    </EditorSection>
  );
}

function ProjectEditor({ draft, setDraft }: ProfileEditorProps) {
  return (
    <EditorSection
      title="Projects"
      emptyText="Add portfolio or work samples that strengthen this profile."
      onAdd={() =>
        setDraft((current) => ({
          ...current,
          projects: [
            ...current.projects,
            {
              name: "",
              description: "",
              technologies: [],
              url: "",
            },
          ],
        }))
      }
    >
      {draft.projects.map((project, index) => (
        <div
          key={index}
          className="grid gap-2 rounded-xl border border-border bg-card/50 p-3"
        >
          <Input
            value={project.name}
            placeholder="Project name"
            onChange={(event) =>
              updateDraftItem(setDraft, "projects", index, {
                name: event.target.value,
              })
            }
          />
          <Input
            value={project.url}
            placeholder="Project link"
            onChange={(event) =>
              updateDraftItem(setDraft, "projects", index, {
                url: event.target.value,
              })
            }
          />
          <textarea
            className="min-h-20 rounded-[10px] border border-input bg-input/10 px-3.5 py-2 text-sm focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
            value={project.description}
            placeholder="Project description"
            onChange={(event) =>
              updateDraftItem(setDraft, "projects", index, {
                description: event.target.value,
              })
            }
          />
          <Input
            value={joinList(project.technologies)}
            placeholder="Tools or technologies, comma separated"
            onChange={(event) =>
              updateDraftItem(setDraft, "projects", index, {
                technologies: splitList(event.target.value),
              })
            }
          />
          <RemoveButton
            onClick={() =>
              removeDraftItem(setDraft, "projects", index)
            }
          />
        </div>
      ))}
    </EditorSection>
  );
}

function EditorSection({
  title,
  emptyText,
  onAdd,
  children,
}: {
  title: string;
  emptyText: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  const hasChildren = Array.isArray(children)
    ? children.length > 0
    : Boolean(children);

  return (
    <fieldset className="grid gap-3 rounded-2xl border border-border p-3">
      <legend className="px-1 text-xs font-semibold uppercase text-muted-foreground">
        {title}
      </legend>
      {hasChildren ? (
        children
      ) : (
        <p className="panel-muted">{emptyText}</p>
      )}
      <Button
        className="panel-button"
        variant="outline"
        size="sm"
        type="button"
        onClick={onAdd}
      >
        Add {title.toLowerCase()}
      </Button>
    </fieldset>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      type="button"
      onClick={onClick}
    >
      Remove
    </Button>
  );
}

export function profileToDraft(
  profile: ApplicantProfile
): ProfileDraft {
  return {
    name: profile.name,
    targetRole: profile.targetRole,
    summary: profile.summary,
    preferredTone: profile.preferredTone,
    workExperiences: profile.workExperiences.map(
      ({
        company,
        title,
        startDate,
        endDate,
        description,
        technologies,
        achievements,
      }) => ({
        company,
        title,
        startDate,
        endDate,
        description,
        technologies,
        achievements,
      })
    ),
    skills: profile.skills.map(
      ({ name, category, yearsOfExperience }) => ({
        name,
        category,
        yearsOfExperience,
      })
    ),
    projects: profile.projects.map(
      ({ name, description, technologies, url }) => ({
        name,
        description,
        technologies,
        url,
      })
    ),
  };
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinList(value: string[]) {
  return value.join(", ");
}

function updateDraftItem<Key extends DraftListKey>(
  setDraft: Dispatch<SetStateAction<ProfileDraft>>,
  key: Key,
  index: number,
  patch: Partial<ProfileDraft[Key][number]>
) {
  setDraft((current) => ({
    ...current,
    [key]: current[key].map((item, itemIndex) =>
      itemIndex === index ? { ...item, ...patch } : item
    ),
  }));
}

function removeDraftItem(
  setDraft: Dispatch<SetStateAction<ProfileDraft>>,
  key: DraftListKey,
  index: number
) {
  setDraft((current) => ({
    ...current,
    [key]: current[key].filter(
      (_, itemIndex) => itemIndex !== index
    ),
  }));
}
