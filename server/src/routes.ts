import { Express, Response } from "express";
import { createAttendeeHandler } from "./controller/attendee.controller";
import { addAttendeeToTalkHandler, createTalkHandler, getAttendeeTalksHandler, getTalkAttendeesHandler, getTalkByIdHandler, getTalksHandler } from "./controller/talk.controller";
import { createAttendeeSessionHandler, getAttendeeSessionsHandler, invalidateAttendeeSessionHandler } from "./controller/session.controller";
import requiresAdmin from "./middleware/requiresAdmin";
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

  // Create talks
  app.post("/api/talks", requiresAdmin, createTalkHandler);

  // Get talks
  app.get("/api/talks", requiresAttendee, getTalksHandler);

  // Get a specific talk
  app.get("/api/talk/:talkId", requiresAttendee, getTalkByIdHandler);

  // Add attendee to talk
  app.post("/api/talks/:talkId/attendees", requiresAdmin, addAttendeeToTalkHandler);

  // Get talk attendees
  app.get("/api/talks/:talkId/attendees", requiresAttendee, getTalkAttendeesHandler);

  // Get attendee talks
  app.get("/api/attendee/talks/:email", getAttendeeTalksHandler);
}
