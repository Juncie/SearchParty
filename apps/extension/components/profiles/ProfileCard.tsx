import type { ApplicantProfile } from "@searchparty/shared";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ProfileCardProps {
  profile: ApplicantProfile;
  isActive: boolean;
  onEdit: () => void;
}

export function ProfileCard({
  profile,
  isActive,
  onEdit,
}: ProfileCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer bg-card/80 transition-all hover:bg-card hover:ring-1 hover:ring-border",
        isActive &&
          "shadow-xl ring-2 ring-primary/70 hover:ring-2 hover:ring-primary/80",
      )}
      onClick={onEdit}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{profile.name}</CardTitle>
            <CardDescription className="mt-1 font-medium text-foreground/80">
              {profile.targetRole}
            </CardDescription>
          </div>
          {isActive ? (
            <span className="status-badge connected">Default</span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 pt-0">
        <dl className="status-details">
          <div>
            <dt>Skills</dt>
            <dd>{profile.skills.length}</dd>
          </div>
          <div>
            <dt>Experience</dt>
            <dd>{profile.workExperiences.length}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
