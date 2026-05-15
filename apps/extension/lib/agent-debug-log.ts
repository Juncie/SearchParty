/** Runtime debug relay → background → NDJSON ingest (session 210883). */
export const extensionDebugAgentLogMessageType =
  "searchparty/debug-agent-log" as const;

const DEBUG_SESSION = "210883";

export function agentDebugLog(input: {
  runId?: string;
  hypothesisId: string;
  location: string;
  message: string;
  data: Record<string, unknown>;
}): void {
  if (
    typeof browser === "undefined" ||
    typeof browser.runtime?.sendMessage !== "function"
  ) {
    return;
  }
  void browser.runtime
    .sendMessage({
      type: extensionDebugAgentLogMessageType,
      sessionId: DEBUG_SESSION,
      ...input,
    })
    .catch(() => { });
}
