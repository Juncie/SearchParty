import { ZodError } from "zod";
import { createFileRoute } from "@tanstack/react-router";
import {
  GenerationServiceError,
  reviewGeneratedDocument,
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

export const Route = createFileRoute("/api/generation/$documentId")({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        const userId = await getAuthenticatedUserId(request);
        if (!userId) {
          return unauthorizedResponse(
            "You must be signed in to review generated documents.",
          );
        }
        try {
          const document = await reviewGeneratedDocument(
            userId,
            params.documentId,
            await request.json(),
          );
          return Response.json({ document });
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
