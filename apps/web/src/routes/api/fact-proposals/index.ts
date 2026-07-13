import { ZodError } from "zod";
import { createFileRoute } from "@tanstack/react-router";
import {
  listFactProposalsForUser,
  reviewFactProposal,
  runResumeTextExtraction,
} from "#/server/fact-proposals";
import { ResumeServiceError } from "#/server/resumes";
import {
  getAuthenticatedUserId,
  unauthorizedResponse,
} from "#/server/authenticated-session";

function badRequestResponse(error: unknown) {
  const message =
    error instanceof ZodError
      ? error.issues.map((issue) => issue.message).join(", ")
      : error instanceof Error
        ? error.message
        : "Invalid request.";
  return Response.json({ message }, { status: 400 });
}

function mapServiceError(error: unknown) {
  if (error instanceof ResumeServiceError) {
    return Response.json({ message: error.message }, { status: error.status });
  }
  return null;
}

export const Route = createFileRoute("/api/fact-proposals/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const userId = await getAuthenticatedUserId(request);
        if (!userId) {
          return unauthorizedResponse(
            "You must be signed in to view résumé proposals.",
          );
        }
        const url = new URL(request.url);
        const status = url.searchParams.get("status") ?? undefined;
        return Response.json(await listFactProposalsForUser(userId, status));
      },
      POST: async ({ request }) => {
        const userId = await getAuthenticatedUserId(request);
        if (!userId) {
          return unauthorizedResponse(
            "You must be signed in to extract résumé facts.",
          );
        }
        try {
          const body = (await request.json()) as {
            resumeId?: string;
            profileId?: string | null;
            text?: string;
          };
          if (!body.resumeId || typeof body.text !== "string") {
            return Response.json(
              {
                message:
                  "resumeId and extracted text are required. SearchParty never invents résumé facts.",
              },
              { status: 400 },
            );
          }
          const result = await runResumeTextExtraction({
            userId,
            resumeId: body.resumeId,
            profileId: body.profileId,
            text: body.text,
          });
          return Response.json(result, { status: 201 });
        } catch (error) {
          const mapped = mapServiceError(error);
          if (mapped) {
            return mapped;
          }
          return badRequestResponse(error);
        }
      },
    },
  },
});
