import { ZodError } from "zod";
import { createFileRoute } from "@tanstack/react-router";
import {
  ApplicationServiceError,
  updateApplication,
} from "#/server/applications";
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
        : "Invalid application request.";
  return Response.json({ message }, { status: 400 });
}

export const Route = createFileRoute("/api/applications/$applicationId")({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        const userId = await getAuthenticatedUserId(request);
        if (!userId) {
          return unauthorizedResponse(
            "You must be signed in to update applications.",
          );
        }
        try {
          const application = await updateApplication(
            userId,
            params.applicationId,
            await request.json(),
          );
          return Response.json({ application });
        } catch (error) {
          if (error instanceof ApplicationServiceError) {
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
