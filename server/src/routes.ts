import { Express, Request, Response } from "express";
import { createAttendeeHandler } from "./controller/attendee.controller";
import { createAttendeeSessionHandler, getAttendeeSessionsHandler, invalidateAttendeeSessionHandler } from "./controller/session.controller";
import requiresAttendee from "./middleware/requiresAttendee";
import validateRequest from "./middleware/validateRequest";
import { createAttendeeSchema, createAttendeeSessionSchema } from "./schema/attendee.schema";

export default function (app: Express) {
  app.get("/healthcheck", (_, res: Response) => res.sendStatus(200));

  // Register attendee
  app.post("/api/attendees", validateRequest(createAttendeeSchema), createAttendeeHandler);

  // Login
  app.post(
    "/api/sessions",
    validateRequest(createAttendeeSessionSchema),
    createAttendeeSessionHandler
  );

  // Get the attendee's sessions
  app.get("/api/sessions", requiresAttendee, getAttendeeSessionsHandler);

  // Logout
  app.delete("/api/sessions", requiresAttendee, invalidateAttendeeSessionHandler);
}
