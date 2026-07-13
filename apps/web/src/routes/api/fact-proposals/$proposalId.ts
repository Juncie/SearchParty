import { ZodError } from "zod";
import { createFileRoute } from "@tanstack/react-router";
import { reviewFactProposal } from "#/server/fact-proposals";
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

export const Route = createFileRoute("/api/fact-proposals/$proposalId")({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        const userId = await getAuthenticatedUserId(request);
        if (!userId) {
          return unauthorizedResponse(
            "You must be signed in to review résumé proposals.",
          );
        }
        try {
          const proposal = await reviewFactProposal(
            userId,
            params.proposalId,
            await request.json(),
          );
          return Response.json({ proposal });
        } catch (error) {
          if (error instanceof ResumeServiceError) {
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
