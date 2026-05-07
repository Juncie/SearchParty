import { useCallback, useEffect, useMemo, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

import type {
  ApplicantProfile,
  ApplicantProfileInput,
  ApplicantProfileTone,
} from "@searchparty/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createApplicantProfile,
  deleteApplicantProfile,
  listApplicantProfiles,
  setActiveApplicantProfile,
  updateApplicantProfile,
} from "@/lib/searchparty-api";
import { cn } from "@/lib/utils";

type ProfileDraft = ApplicantProfileInput;

type DraftListKey = "workExperiences" | "skills" | "projects";

const emptyDraft: ProfileDraft = {
  name: "",
  targetRole: "",
  summary: "",
  preferredTone: "professional",
  workExperiences: [],
  skills: [],
  projects: [],
};

const profileTemplates: ProfileDraft[] = [
  {
    name: "Frontend profile",
    targetRole: "Frontend Engineer",
    summary:
      "Frontend-focused profile for React, accessibility, and product UI roles.",
    preferredTone: "professional",
    workExperiences: [],
    skills: [
      { name: "React", category: "Frontend", yearsOfExperience: 5 },
      { name: "TypeScript", category: "Frontend", yearsOfExperience: 5 },
    ],
    projects: [],
  },
  {
    name: "Full Stack profile",
    targetRole: "Full Stack Engineer",
    summary:
      "Full stack profile emphasizing React, APIs, databases, and shipping product features.",
    preferredTone: "confident",
    workExperiences: [],
    skills: [
      { name: "React", category: "Frontend", yearsOfExperience: 5 },
      { name: "PostgreSQL", category: "Backend", yearsOfExperience: 3 },
    ],
    projects: [],
  },
  {
    name: "Shopify/Webflow profile",
    targetRole: "Shopify / Webflow Developer",
    summary:
      "Commerce and no-code implementation profile for fast storefront and marketing site delivery.",
    preferredTone: "friendly",
    workExperiences: [],
    skills: [
      { name: "Shopify", category: "Commerce", yearsOfExperience: 3 },
      { name: "Webflow", category: "No-code", yearsOfExperience: 3 },
    ],
    projects: [],
  },
];

export function ProfileManager() {
  const [profiles, setProfiles] = useState<ApplicantProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProfileDraft>(emptyDraft);
  const [status, setStatus] = useState<"idle" | "loading" | "saving">("loading");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const editingProfile = useMemo(
    () => profiles.find((profile) => profile.id === editingProfileId) ?? null,
    [editingProfileId, profiles],
  );

  const loadProfiles = useCallback(async () => {
    setError(null);
    setStatus("loading");

    try {
      const response = await listApplicantProfiles();
      setProfiles(response.profiles);
      setActiveProfileId(response.activeProfileId);

      const nextProfile =
        response.profiles.find(
          (profile) => profile.id === response.activeProfileId,
        ) ?? response.profiles[0] ?? null;

      setEditingProfileId(nextProfile?.id ?? null);
      setDraft(nextProfile ? profileToDraft(nextProfile) : emptyDraft);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load profiles.",
      );
    } finally {
      setStatus("idle");
    }
  }, []);

  useEffect(() => {
    void loadProfiles();
  }, [loadProfiles]);

  const startNewProfile = useCallback((template?: ProfileDraft) => {
    setEditingProfileId(null);
    setDraft(template ?? emptyDraft);
    setMessage(template ? `Loaded ${template.name}. Review and save it.` : null);
    setError(null);
  }, []);

  const selectProfile = useCallback((profile: ApplicantProfile) => {
    setEditingProfileId(profile.id);
    setDraft(profileToDraft(profile));
    setError(null);
    setMessage(null);
  }, []);

  const saveProfile = useCallback(async () => {
    setStatus("saving");
    setError(null);
    setMessage(null);

    try {
      const savedProfile = editingProfileId
        ? await updateApplicantProfile(editingProfileId, draft)
        : await createApplicantProfile(draft);

      const response = await listApplicantProfiles();
      setProfiles(response.profiles);
      setActiveProfileId(response.activeProfileId);
      setEditingProfileId(savedProfile.id);
      setDraft(profileToDraft(savedProfile));
      setMessage(
        editingProfileId ? "Profile updated." : "Profile created and selected.",
      );
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save profile.",
      );
    } finally {
      setStatus("idle");
    }
  }, [draft, editingProfileId]);

  const activateProfile = useCallback(async (profileId: string) => {
    setStatus("saving");
    setError(null);

    try {
      const response = await setActiveApplicantProfile(profileId);
      setProfiles(response.profiles);
      setActiveProfileId(response.activeProfileId);
      setMessage("Active profile selected.");
    } catch (activeError) {
      setError(
        activeError instanceof Error
          ? activeError.message
          : "Unable to select active profile.",
      );
    } finally {
      setStatus("idle");
    }
  }, []);

  const removeProfile = useCallback(async () => {
    if (!editingProfileId) return;
    setStatus("saving");
    setError(null);
    setMessage(null);

    try {
      await deleteApplicantProfile(editingProfileId);
      await loadProfiles();
      setMessage("Profile deleted.");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete profile.",
      );
    } finally {
      setStatus("idle");
    }
  }, [editingProfileId, loadProfiles]);

  return (
    <section className="status-card profile-card" aria-live="polite">
      <div className="space-y-2">
        <p className="island-kicker">Phase 2</p>
        <h2>Applicant profiles</h2>
        <p className="panel-muted">
          Create reusable profiles for different job searches, then choose the
          active profile the extension should use.
        </p>
      </div>

      <div className="grid gap-2">
        <p className="status-label text-xs font-semibold uppercase text-muted-foreground">
          Quick starts
        </p>
        <div className="panel-actions">
          {profileTemplates.map((template) => (
            <Button
              key={template.name}
              className="panel-button"
              variant="outline"
              size="sm"
              type="button"
              onClick={() => startNewProfile(template)}
            >
              {template.name}
            </Button>
          ))}
        </div>
      </div>

      {profiles.length > 0 ? (
        <div className="grid gap-2">
          <p className="status-label text-xs font-semibold uppercase text-muted-foreground">
            Saved profiles
          </p>
          <div className="grid gap-2">
            {profiles.map((profile) => (
              <button
                key={profile.id}
                type="button"
                className={cn(
                  "rounded-xl border border-border bg-card/70 p-3 text-left transition hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  profile.id === editingProfileId && "border-primary/50",
                )}
                onClick={() => selectProfile(profile)}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{profile.name}</span>
                  {profile.id === activeProfileId ? (
                    <span className="status-badge connected">Active</span>
                  ) : null}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {profile.targetRole}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <ProfileForm draft={draft} setDraft={setDraft} />

      {error ? <p className="error-message text-destructive">{error}</p> : null}
      {message ? <p className="panel-muted">{message}</p> : null}

      <div className="panel-actions">
        <Button
          className="panel-button"
          type="button"
          onClick={() => void saveProfile()}
          disabled={status !== "idle"}
        >
          {status === "saving"
            ? "Saving..."
            : editingProfile
              ? "Save changes"
              : "Create profile"}
        </Button>
        <Button
          className="panel-button"
          variant="outline"
          type="button"
          onClick={() => startNewProfile()}
          disabled={status !== "idle"}
        >
          New profile
        </Button>
        {editingProfile ? (
          <>
            <Button
              className="panel-button"
              variant="outline"
              type="button"
              onClick={() => void activateProfile(editingProfile.id)}
              disabled={
                status !== "idle" || activeProfileId === editingProfile.id
              }
            >
              Make active
            </Button>
            <Button
              className="panel-button"
              variant="destructive"
              type="button"
              onClick={() => void removeProfile()}
              disabled={status !== "idle"}
            >
              Delete
            </Button>
          </>
        ) : null}
      </div>
    </section>
  );
}

function ProfileForm({
  draft,
  setDraft,
}: {
  draft: ProfileDraft;
  setDraft: Dispatch<SetStateAction<ProfileDraft>>;
}) {
  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <div className="grid gap-3">
        <label className="grid gap-1 text-xs font-semibold">
          Profile name
          <Input
            value={draft.name}
            onChange={(event) =>
              setDraft((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="Frontend profile"
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
            placeholder="Frontend Engineer"
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
                preferredTone: event.target.value as ApplicantProfileTone,
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
            className="min-h-20 rounded-[10px] border border-input bg-input/10 px-3.5 py-2 text-sm focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
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
      </div>

      <WorkExperienceEditor draft={draft} setDraft={setDraft} />
      <SkillEditor draft={draft} setDraft={setDraft} />
      <ProjectEditor draft={draft} setDraft={setDraft} />
    </form>
  );
}

function WorkExperienceEditor({
  draft,
  setDraft,
}: {
  draft: ProfileDraft;
  setDraft: Dispatch<SetStateAction<ProfileDraft>>;
}) {
  return (
    <ProfileSection
      title="Work history"
      emptyText="No work history yet."
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
        <div key={index} className="grid gap-2 rounded-xl border border-border p-3">
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
                updateDraftItem(setDraft, "workExperiences", index, {
                  startDate: event.target.value,
                })
              }
            />
            <Input
              value={experience.endDate}
              placeholder="End"
              onChange={(event) =>
                updateDraftItem(setDraft, "workExperiences", index, {
                  endDate: event.target.value,
                })
              }
            />
          </div>
          <textarea
            className="min-h-16 rounded-[10px] border border-input bg-input/10 px-3.5 py-2 text-sm focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
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
            placeholder="Tech stack, comma separated"
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
          <RemoveItemButton
            onClick={() => removeDraftItem(setDraft, "workExperiences", index)}
          />
        </div>
      ))}
    </ProfileSection>
  );
}

function SkillEditor({
  draft,
  setDraft,
}: {
  draft: ProfileDraft;
  setDraft: Dispatch<SetStateAction<ProfileDraft>>;
}) {
  return (
    <ProfileSection
      title="Skills"
      emptyText="No skills yet."
      onAdd={() =>
        setDraft((current) => ({
          ...current,
          skills: [
            ...current.skills,
            { name: "", category: "", yearsOfExperience: 0 },
          ],
        }))
      }
    >
      {draft.skills.map((skill, index) => (
        <div key={index} className="grid gap-2 rounded-xl border border-border p-3">
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
          <RemoveItemButton onClick={() => removeDraftItem(setDraft, "skills", index)} />
        </div>
      ))}
    </ProfileSection>
  );
}

function ProjectEditor({
  draft,
  setDraft,
}: {
  draft: ProfileDraft;
  setDraft: Dispatch<SetStateAction<ProfileDraft>>;
}) {
  return (
    <ProfileSection
      title="Projects"
      emptyText="No projects yet."
      onAdd={() =>
        setDraft((current) => ({
          ...current,
          projects: [
            ...current.projects,
            { name: "", description: "", technologies: [], url: "" },
          ],
        }))
      }
    >
      {draft.projects.map((project, index) => (
        <div key={index} className="grid gap-2 rounded-xl border border-border p-3">
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
            className="min-h-16 rounded-[10px] border border-input bg-input/10 px-3.5 py-2 text-sm focus-visible:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
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
            placeholder="Technologies, comma separated"
            onChange={(event) =>
              updateDraftItem(setDraft, "projects", index, {
                technologies: splitList(event.target.value),
              })
            }
          />
          <RemoveItemButton
            onClick={() => removeDraftItem(setDraft, "projects", index)}
          />
        </div>
      ))}
    </ProfileSection>
  );
}

function ProfileSection({
  title,
  emptyText,
  onAdd,
  children,
}: {
  title: string;
  emptyText: string;
  onAdd: () => void;
  children: ReactNode;
}) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : Boolean(children);

  return (
    <fieldset className="grid gap-2 rounded-2xl border border-border p-3">
      <legend className="px-1 text-xs font-semibold uppercase text-muted-foreground">
        {title}
      </legend>
      {hasChildren ? children : <p className="panel-muted">{emptyText}</p>}
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

function RemoveItemButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" size="sm" type="button" onClick={onClick}>
      Remove
    </Button>
  );
}

function profileToDraft(profile: ApplicantProfile): ProfileDraft {
  return {
    name: profile.name,
    targetRole: profile.targetRole,
    summary: profile.summary,
    preferredTone: profile.preferredTone,
    workExperiences: profile.workExperiences.map(
      ({ company, title, startDate, endDate, description, technologies, achievements }) => ({
        company,
        title,
        startDate,
        endDate,
        description,
        technologies,
        achievements,
      }),
    ),
    skills: profile.skills.map(({ name, category, yearsOfExperience }) => ({
      name,
      category,
      yearsOfExperience,
    })),
    projects: profile.projects.map(({ name, description, technologies, url }) => ({
      name,
      description,
      technologies,
      url,
    })),
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
  patch: Partial<ProfileDraft[Key][number]>,
) {
  setDraft((current) => ({
    ...current,
    [key]: current[key].map((item, itemIndex) =>
      itemIndex === index ? { ...item, ...patch } : item,
    ),
  }));
}

function removeDraftItem(
  setDraft: Dispatch<SetStateAction<ProfileDraft>>,
  key: DraftListKey,
  index: number,
) {
  setDraft((current) => ({
    ...current,
    [key]: current[key].filter((_, itemIndex) => itemIndex !== index),
  }));
}
