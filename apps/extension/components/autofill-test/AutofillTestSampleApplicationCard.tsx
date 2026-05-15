import { FormEvent, useRef, useState } from "react";

import { formatPhoneNumberMask } from "@searchparty/utils";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const textareaClassName = cn(
  "flex min-h-[120px] w-full resize-y rounded-[10px] border border-input bg-input/10 px-3.5 py-2 text-sm ring-offset-background transition-all duration-200",
  "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/40 focus-visible:border-primary/50 focus-visible:bg-background/50",
  "hover:bg-input/20 hover:border-input/80 disabled:cursor-not-allowed disabled:opacity-50 md:text-xs/relaxed dark:bg-input/20 dark:hover:bg-input/30",
);

const resumeAccept =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AutofillTestSampleApplicationCard() {
  const [phone, setPhone] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const clearResume = () => {
    setResumeFile(null);
    if (resumeInputRef.current) {
      resumeInputRef.current.value = "";
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Apply — Software Engineer (Sample)</CardTitle>
        <CardDescription>
          Fields use common labels and <code>autocomplete</code> hints so they
          map to your profile.
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="grid gap-4 @md:grid-cols-2">
          <div className="grid gap-2 @md:col-span-1">
            <label
              className="text-xs font-medium text-foreground"
              htmlFor="sp-first-name"
            >
              First name
            </label>
            <Input
              id="sp-first-name"
              name="firstName"
              autoComplete="given-name"
              placeholder="Jamie"
            />
          </div>
          <div className="grid gap-2 @md:col-span-1">
            <label
              className="text-xs font-medium text-foreground"
              htmlFor="sp-last-name"
            >
              Last name
            </label>
            <Input
              id="sp-last-name"
              name="lastName"
              autoComplete="family-name"
              placeholder="Doe"
            />
          </div>
          <div className="grid gap-2 @md:col-span-2">
            <label
              className="text-xs font-medium text-foreground"
              htmlFor="sp-email"
            >
              Email address
            </label>
            <Input
              id="sp-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
          <div className="grid gap-2 @md:col-span-2">
            <label
              className="text-xs font-medium text-foreground"
              htmlFor="sp-phone"
            >
              Mobile phone number
            </label>
            <Input
              id="sp-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+1 555 0100"
              value={phone}
              onChange={(e) => {
                setPhone(formatPhoneNumberMask(e.target.value));
              }}
            />
          </div>
          <div className="grid gap-2 @md:col-span-2">
            <label
              className="text-xs font-medium text-foreground"
              htmlFor="sp-address"
            >
              Mailing address
            </label>
            <textarea
              id="sp-address"
              name="streetAddress"
              className={textareaClassName}
              autoComplete="street-address"
              placeholder="Street, city, region, postal code"
              rows={4}
            />
          </div>
          <div className="grid gap-2 @md:col-span-2">
            <label
              className="text-xs font-medium text-foreground"
              htmlFor="sp-linkedin"
            >
              LinkedIn
            </label>
            <Input
              id="sp-linkedin"
              name="linkedin"
              type="url"
              placeholder="https://linkedin.com/in/…"
            />
          </div>
          <div className="grid gap-2 @md:col-span-1">
            <label
              className="text-xs font-medium text-foreground"
              htmlFor="sp-github"
            >
              GitHub
            </label>
            <Input
              id="sp-github"
              name="github"
              type="url"
              placeholder="https://github.com/…"
            />
          </div>
          <div className="grid gap-2 @md:col-span-1">
            <label
              className="text-xs font-medium text-foreground"
              htmlFor="sp-portfolio"
            >
              Portfolio or personal website
            </label>
            <Input
              id="sp-portfolio"
              name="portfolio"
              type="url"
              autoComplete="url"
              placeholder="https://…"
            />
          </div>
          <div className="grid gap-2 @md:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className="text-xs font-medium text-foreground"
                id="sp-resume-label"
              >
                Résumé or CV
              </span>
              {resumeFile ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto cursor-pointer py-1 text-xs text-muted-foreground hover:text-foreground"
                  onClick={clearResume}
                >
                  Remove file
                </Button>
              ) : null}
            </div>
            <label
              className={cn(
                "inline-flex cursor-pointer flex-col rounded-[10px] border border-dashed border-border px-3 py-6 text-xs ring-offset-background transition-colors",
                "hover:border-primary/50 hover:bg-muted/40 hover:text-foreground focus-within:ring-1 focus-within:ring-ring/40 text-muted-foreground",
              )}
              htmlFor="sp-resume"
            >
              <input
                ref={resumeInputRef}
                id="sp-resume"
                name="resume"
                type="file"
                accept={resumeAccept}
                className="sr-only"
                aria-labelledby="sp-resume-label"
                onChange={(event) => {
                  const file = event.target.files?.item(0) ?? null;
                  setResumeFile(file);
                }}
              />
              <span className="text-xs/relaxed text-muted-foreground">
                {resumeFile ? (
                  <>
                    <span className="font-medium text-foreground">
                      {resumeFile.name}
                    </span>
                    <span className="text-muted-foreground">
                      {" "}
                      · {formatFileSize(resumeFile.size)}
                      {resumeFile.type ? ` · ${resumeFile.type}` : ""}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-medium text-foreground">
                      Choose file
                    </span>
                    <span> — PDF, Word (.doc, .docx)</span>
                  </>
                )}
              </span>
            </label>
          </div>
          <div className="grid gap-2 @md:col-span-2">
            <label
              className="text-xs font-medium text-foreground"
              htmlFor="sp-cover"
            >
              Cover letter (optional)
            </label>
            <textarea
              id="sp-cover"
              name="coverLetter"
              className={textareaClassName}
              placeholder="Tell us why you are a great fit…"
              rows={5}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 border-t border-border pt-4">
          <Button type="submit">Submit application</Button>
          <Button type="button" variant="outline">
            Save draft
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
