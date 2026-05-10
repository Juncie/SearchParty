import type { AccountSetup, CustomUrl } from "@searchparty/shared";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface AccountCustomUrlsCardProps {
  setup: AccountSetup;
  onSetupChange: (next: AccountSetup) => void;
}

export function AccountCustomUrlsCard({
  setup,
  onSetupChange,
}: AccountCustomUrlsCardProps) {
  const updateUrl = (
    index: number,
    field: keyof CustomUrl,
    value: string,
  ) => {
    onSetupChange({
      ...setup,
      urls: setup.urls.map((u, i) =>
        i === index ? { ...u, [field]: value } : u,
      ),
    });
  };

  const removeUrl = (index: number) => {
    onSetupChange({
      ...setup,
      urls: setup.urls.filter((_, i) => i !== index),
    });
  };

  const addUrl = () => {
    onSetupChange({
      ...setup,
      urls: [...setup.urls, { label: "", url: "" }],
    });
  };

  return (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle>Custom URLs</CardTitle>
        <CardDescription>
          Add links to your LinkedIn, GitHub, portfolio, or any other relevant
          sites.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {setup.urls.map((url, index) => (
          <div
            key={index}
            className="grid gap-2 rounded-xl border border-border bg-card/50 p-3"
          >
            <div className="grid gap-2 @sm:grid-cols-2">
              <label className="grid gap-1 text-xs font-semibold">
                Label
                <Input
                  value={url.label}
                  onChange={(e) =>
                    updateUrl(index, "label", e.target.value)
                  }
                  placeholder="e.g. LinkedIn"
                />
              </label>
              <label className="grid gap-1 text-xs font-semibold">
                URL
                <Input
                  value={url.url}
                  onChange={(e) =>
                    updateUrl(index, "url", e.target.value)
                  }
                  placeholder="https://..."
                  type="url"
                />
              </label>
            </div>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => removeUrl(index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="w-fit"
          onClick={addUrl}
        >
          Add URL
        </Button>
      </CardContent>
    </Card>
  );
}
