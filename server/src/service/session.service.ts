import { LeanDocument, FilterQuery, UpdateQuery } from "mongoose";
import config from "config";
import { get } from "lodash";
import { AttendeeDocument } from "../model/attendee.model";
import { findAttendee } from "./attendee.service";
import Session, { SessionDocument } from "../model/session.model";
import { decode, sign } from "../utils/jwt.utils";

export async function createSession(attendeeId: string, attendeeAgent: string) {
  const session = await Session.create({ attendee: attendeeId, attendeeAgent });

  return session.toJSON();
}

export function createAccessToken({
  attendee,
  session,
}: {
  attendee:
    | Omit<AttendeeDocument, "password">
    | LeanDocument<Omit<AttendeeDocument, "password">>;
  session:
    | Omit<SessionDocument, "password">
    | LeanDocument<Omit<SessionDocument, "password">>;
}) {
  const accessToken = sign(
    { ...attendee, session: session._id },
    { expiresIn: config.get("accessTokenTtl") }
  );

  return accessToken;
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = decode(refreshToken);

  if (!decoded || !get(decoded, "_id")) return false;

  const session = await Session.findById(get(decoded, "_id"));

  if (!session || !session?.valid) return false;

  const attendee = await findAttendee({ _id: session.attendee });

  if (!attendee) return false;

  const accessToken = createAccessToken({ attendee, session });

  return accessToken;
}

export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) {
  return Session.updateOne(query, update);
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
  return Session.find(query).lean();
}
