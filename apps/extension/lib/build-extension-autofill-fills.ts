import type {
  AutofillPayloadValues,
  ExtensionAutofillFill,
  ScannedAutofillFieldPayload,
} from "@searchparty/shared";
import { valueForAutofillKind } from "@searchparty/shared";

import { fetchResumeDownloadPayloadForAutofill } from "@/lib/searchparty-api";

/** Ready résumé metadata for presigned URL autofill plus UI label. */
export type DefaultResumeForAutofill = {
  id: string;
  label: string;
  mimeType: string;
};

/**
 * Builds the fill list for `tabs.sendMessage` apply, including resume file
 * attachments when a ready resume exists in SearchParty storage.
 */
export async function buildExtensionAutofillFills(input: {
  fields: ScannedAutofillFieldPayload[];
  selected: Record<string, boolean>;
  payload: AutofillPayloadValues;
  defaultResume: DefaultResumeForAutofill | null;
}): Promise<ExtensionAutofillFill[]> {
  const { fields, selected, payload, defaultResume } = input;
  const fills: ExtensionAutofillFill[] = [];
  let resumePayloadCache: {
    downloadUrl: string;
    fileName: string;
  } | null = null;

  for (const field of fields) {
    if (!selected[field.spId] || field.fillStatus !== "fillable") {
      continue;
    }

    if (field.kind === "resume" && field.interactionType === "file") {
      if (!defaultResume) {
        continue;
      }
      if (!resumePayloadCache) {
        resumePayloadCache =
          await fetchResumeDownloadPayloadForAutofill(
            defaultResume.id,
            defaultResume.mimeType,
          );
      }
      fills.push({
        spId: field.spId,
        value: "",
        fileDownloadUrl: resumePayloadCache.downloadUrl,
        fileName: resumePayloadCache.fileName,
      });
      continue;
    }

    const value = valueForAutofillKind(payload, field.kind);
    if (value.trim().length === 0) {
      continue;
    }
    fills.push({ spId: field.spId, value });
  }

  return fills;
}
