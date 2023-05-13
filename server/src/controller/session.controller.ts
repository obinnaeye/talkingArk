import config from "config";
import { get } from "lodash";
import { Request, Response } from "express";
import {
  createSession,
  createAccessToken,
  updateSession,
  findSessions,
} from "../service/session.service";
import { sign } from "../utils/jwt.utils";
import { validatePassword } from "../service/attendee.service";

export async function createAttendeeSessionHandler(req: Request, res: Response) {
  const attendee = await validatePassword(req.body);

  if (!attendee) {
    return res.status(401).send("Invalid attendeename or password");
  }

  const session = await createSession(attendee._id, req.get("attendee-agent") || "");
  const accessToken = createAccessToken({
    attendee,
    session,
  });
  const refreshToken = sign(session, {
    expiresIn: config.get("refreshTokenTtl"),
  });

  return res.send({ accessToken, refreshToken });
}

export async function invalidateAttendeeSessionHandler(
  req: Request,
  res: Response
) {
  const sessionId = get(req, "attendee.session");

  await updateSession({ _id: sessionId }, { valid: false });

  return res.sendStatus(200);
}

export async function getAttendeeSessionsHandler(req: Request, res: Response) {
  const attendeeId = get(req, "attendee._id");
  const sessions = await findSessions({ attendee: attendeeId, valid: true });

  return res.send(sessions);
}
