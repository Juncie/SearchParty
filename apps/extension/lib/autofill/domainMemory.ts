import type {
  AutofillFieldKind,
  DomainMemoryHint,
} from "@searchparty/shared";

const STORAGE_KEY = "searchparty.autofill.domainMemory.v1";

export type DomainAutofillMemory = {
  domain: string;
  fieldSelector: string;
  kind: AutofillFieldKind;
  acceptedCount: number;
  rejectedCount: number;
  lastUsedAt: string;
};

function entryKey(
  domain: string,
  fieldSelector: string
): string {
  return `${domain}::${fieldSelector}`;
}

async function readMemory(): Promise<
  Record<string, DomainAutofillMemory>
> {
  const raw = await browser.storage.local.get(STORAGE_KEY);
  const value = raw[STORAGE_KEY];
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return {};
  }
  return value as Record<string, DomainAutofillMemory>;
}

async function writeMemory(
  memory: Record<string, DomainAutofillMemory>
): Promise<void> {
  await browser.storage.local.set({
    [STORAGE_KEY]: memory,
  });
}

/** Returns the origin used to scope domain memory for the current page. */
export function currentDomainMemoryKey(
  locationValue = location.href
): string {
  try {
    return new URL(locationValue).origin;
  } catch {
    return "unknown-origin";
  }
}

/** Loads the matching memory hint for a field selector on the current domain. */
export async function readDomainMemoryHint(
  domain: string,
  fieldSelector: string | undefined
): Promise<DomainMemoryHint | undefined> {
  if (!fieldSelector) {
    return undefined;
  }
  const memory = await readMemory();
  const entry = memory[entryKey(domain, fieldSelector)];
  if (!entry) {
    return undefined;
  }
  return {
    kind: entry.kind,
    acceptedCount: entry.acceptedCount,
    rejectedCount: entry.rejectedCount,
  };
}

/** Records fields that the user allowed SearchParty to apply on a domain. */
export async function recordAcceptedAutofillMatches(
  domain: string,
  matches: ReadonlyArray<{
    fieldSelector: string | undefined;
    kind: AutofillFieldKind;
  }>
): Promise<void> {
  const memory = await readMemory();
  const lastUsedAt = new Date().toISOString();

  for (const match of matches) {
    if (!match.fieldSelector) {
      continue;
    }
    const key = entryKey(domain, match.fieldSelector);
    const current = memory[key];
    memory[key] = {
      domain,
      fieldSelector: match.fieldSelector,
      kind: match.kind,
      acceptedCount:
        current?.kind === match.kind
          ? current.acceptedCount + 1
          : 1,
      rejectedCount:
        current?.kind === match.kind
          ? current.rejectedCount
          : 0,
      lastUsedAt,
    };
  }

  await writeMemory(memory);
}
