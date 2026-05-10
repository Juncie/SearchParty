import type { Dispatch, SetStateAction } from "react";

import {
  ProfileEditor,
  type ProfileDraft,
} from "@/components/profiles/ProfileEditor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProfileEditorSectionCardProps {
  isEditing: boolean;
  draft: ProfileDraft;
  setDraft: Dispatch<SetStateAction<ProfileDraft>>;
}

export function ProfileEditorSectionCard({
  isEditing,
  draft,
  setDraft,
}: ProfileEditorSectionCardProps) {
  return (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle>
          <h2 className="text-lg font-semibold">
            {isEditing ? "Profile fields" : "New profile"}
          </h2>
        </CardTitle>
        <CardDescription>
          These details power future autofill, generated
          answers, and tailored documents.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileEditor draft={draft} setDraft={setDraft} />
      </CardContent>
    </Card>
  );
}
