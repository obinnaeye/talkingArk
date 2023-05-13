import { Request, Response } from "express";
import { omit } from "lodash";
import log from "../logger";
import { createAttendee } from "../service/attendee.service";

export async function createAttendeeHandler(req: Request, res: Response) {
  try {
    const attendee = await createAttendee(req.body);
    return res.send(omit(attendee.toJSON(), "password"));
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}
