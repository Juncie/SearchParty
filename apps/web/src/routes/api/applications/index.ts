import { ZodError } from "zod";
import { createFileRoute } from "@tanstack/react-router";
import {
  ApplicationServiceError,
  createApplication,
  listApplicationsForUser,
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

export const Route = createFileRoute("/api/applications/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const userId = await getAuthenticatedUserId(request);
        if (!userId) {
          return unauthorizedResponse(
            "You must be signed in to list applications.",
          );
        }
        return Response.json(await listApplicationsForUser(userId));
      },
      POST: async ({ request }) => {
        const userId = await getAuthenticatedUserId(request);
        if (!userId) {
          return unauthorizedResponse(
            "You must be signed in to track applications.",
          );
        }
        try {
          const application = await createApplication(
            userId,
            await request.json(),
          );
          return Response.json({ application }, { status: 201 });
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
