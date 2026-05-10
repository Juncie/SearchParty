import { Button } from "@/components/ui/button";

interface ProfileEditDirtySaveBarProps {
  visible: boolean;
  isSaving: boolean;
  onSave: () => void;
}

export function ProfileEditDirtySaveBar({
  visible,
  isSaving,
  onSave,
}: ProfileEditDirtySaveBarProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <Button
        size="lg"
        type="button"
        className="shadow-xl"
        onClick={() => void onSave()}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save profile"}
      </Button>
    </div>
  );
}
