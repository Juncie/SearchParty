import { ZodError } from "zod";
import { createFileRoute } from "@tanstack/react-router";
import {
  GenerationServiceError,
  generateDocumentDraft,
  listGeneratedDocumentsForUser,
} from "#/server/generation";
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
        : "Invalid generation request.";
  return Response.json({ message }, { status: 400 });
}

export const Route = createFileRoute("/api/generation/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const userId = await getAuthenticatedUserId(request);
        if (!userId) {
          return unauthorizedResponse(
            "You must be signed in to list generated documents.",
          );
        }
        return Response.json(await listGeneratedDocumentsForUser(userId));
      },
      POST: async ({ request }) => {
        const userId = await getAuthenticatedUserId(request);
        if (!userId) {
          return unauthorizedResponse(
            "You must be signed in to generate documents.",
          );
        }
        try {
          const document = await generateDocumentDraft(
            userId,
            await request.json(),
          );
          return Response.json({ document }, { status: 201 });
        } catch (error) {
          if (error instanceof GenerationServiceError) {
            return Response.json(
              { message: error.message },
              { status: error.status },
            );
          }
          return badRequestResponse(error);
        }
      },
    },
  },
});
