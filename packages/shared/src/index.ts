import { z } from "zod";

export const SEARCHPARTY_APP = {
  name: "SearchParty",
  webDevUrl: "http://localhost:4310",
} as const;

export const healthStatusSchema = z.enum(["ok"]);

export const healthResponseSchema = z.object({
  app: z.literal(SEARCHPARTY_APP.name),
  status: healthStatusSchema,
  timestamp: z.string().datetime(),
  version: z.string(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

export function createHealthResponse(version = "0.0.0"): HealthResponse {
  return healthResponseSchema.parse({
    app: SEARCHPARTY_APP.name,
    status: "ok",
    timestamp: new Date().toISOString(),
    version,
  });
}
