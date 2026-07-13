import { ZodError } from "zod";
import { createFileRoute } from "@tanstack/react-router";
import { createJobPosting, listJobPostingsForUser } from "#/server/jobs";
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
        : "Invalid job request.";
  return Response.json({ message }, { status: 400 });
}

export const Route = createFileRoute("/api/jobs/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const userId = await getAuthenticatedUserId(request);
        if (!userId) {
          return unauthorizedResponse("You must be signed in to list jobs.");
        }
        return Response.json(await listJobPostingsForUser(userId));
      },
      POST: async ({ request }) => {
        const userId = await getAuthenticatedUserId(request);
        if (!userId) {
          return unauthorizedResponse("You must be signed in to save jobs.");
        }
        try {
          const job = await createJobPosting(userId, await request.json());
          return Response.json({ job }, { status: 201 });
        } catch (error) {
          return badRequestResponse(error);
        }
      },
    },
  },
});
