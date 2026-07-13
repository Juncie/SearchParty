import { useCallback, useState } from "react";
import { ArrowLeft, Briefcase } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

import type { JobExtractionInput } from "@searchparty/shared";

import type { ExtensionSurface } from "@/components/extension-surface";
import { HeroCard } from "@/components/HeroCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { saveJobPosting } from "@/lib/searchparty-api";

interface SaveJobPageProps {
  surface: ExtensionSurface;
}

/**
 * Lets the user preview and save the current tab's job posting.
 * Extraction is deterministic; empty fields stay empty.
 */
export function SaveJobPage({ surface }: SaveJobPageProps) {
  void surface;
  const navigate = useNavigate();
  const [preview, setPreview] =
    useState<JobExtractionInput | null>(null);
  const [status, setStatus] = useState<
    "idle" | "extracting" | "saving"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const extract = useCallback(async () => {
    setError(null);
    setNotice(null);
    setStatus("extracting");
    try {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab?.id) {
        throw new Error("No active tab found.");
      }
      const results = await browser.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: () => {
            const title =
              document
                .querySelector("h1")
                ?.textContent?.trim() || document.title;
            const company =
              document
                .querySelector(
                  "meta[property='og:site_name']"
                )
                ?.getAttribute("content")
                ?.trim() || "";
            const description =
              document
                .querySelector("main")
                ?.textContent?.trim()
                .slice(0, 8000) || "";
            return {
              sourceUrl: window.location.href,
              title,
              company,
              description,
              location: "",
              host: window.location.hostname,
            };
          },
        }
      );
      const payload = results[0]?.result;
      if (!payload) {
        throw new Error("Could not read this page.");
      }
      const platform = payload.host.includes("greenhouse")
        ? "greenhouse"
        : payload.host.includes("lever.co")
          ? "lever"
          : payload.host.includes("ashby")
            ? "ashby"
            : "generic";
      setPreview({
        sourceUrl: payload.sourceUrl,
        platform,
        company: payload.company,
        title: payload.title,
        location: payload.location,
        description: payload.description,
        requirements: "",
        extractorVersion: "job-extract-v1",
        rawEvidence: { host: payload.host },
      });
      setNotice("Review the extracted job before saving.");
    } catch (extractError) {
      setError(
        extractError instanceof Error
          ? extractError.message
          : "Could not extract this job page."
      );
      setPreview(null);
    } finally {
      setStatus("idle");
    }
  }, []);

  const save = useCallback(async () => {
    if (!preview) {
      return;
    }
    setStatus("saving");
    setError(null);
    try {
      const { job } = await saveJobPosting(preview);
      setNotice(
        `Saved “${job.title || "Untitled role"}” at ${job.company || "company"}.`
      );
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save this job."
      );
    } finally {
      setStatus("idle");
    }
  }, [preview]);

  return (
    <main className="grid gap-6 pb-24">
      <HeroCard
        title="Save job"
        greeting="Capture this role"
        description="SearchParty extracts what it can from the page. You review before anything is stored."
        action={() => void navigate({ to: "/dashboard" })}
        actionIcon={ArrowLeft}
        actionTitle="Dashboard"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Briefcase className="size-4" />
            Current page
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => void extract()}
              disabled={status !== "idle"}
              className="cursor-pointer"
            >
              {status === "extracting"
                ? "Reading…"
                : "Extract job"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => void save()}
              disabled={!preview || status !== "idle"}
              className="cursor-pointer"
            >
              {status === "saving" ? "Saving…" : "Save job"}
            </Button>
          </div>
          {error ? (
            <p
              role="alert"
              className="text-xs text-destructive"
            >
              {error}
            </p>
          ) : null}
          {notice ? (
            <p className="text-xs text-muted-foreground">
              {notice}
            </p>
          ) : null}
          {preview ? (
            <dl className="grid gap-2 text-xs">
              <div>
                <dt className="text-muted-foreground">
                  Title
                </dt>
                <dd className="font-medium">
                  {preview.title || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">
                  Company
                </dt>
                <dd className="font-medium">
                  {preview.company || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">
                  Platform
                </dt>
                <dd className="font-medium">
                  {preview.platform}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">
                  Source
                </dt>
                <dd className="break-all font-medium">
                  {preview.sourceUrl}
                </dd>
              </div>
            </dl>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
