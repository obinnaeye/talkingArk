import { DocumentDefinition, FilterQuery } from "mongoose";
import { omit } from "lodash";
import Attendee, { AttendeeDocument } from "../model/attendee.model";

export async function createAttendee(input: DocumentDefinition<AttendeeDocument>) {
  try {
    return await Attendee.create(input);
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getAttendees(query: FilterQuery<AttendeeDocument>) {
  return Attendee.find(query).lean();
}

export async function findAttendee(query: FilterQuery<AttendeeDocument>) {
  return Attendee.findOne(query).lean();
}

export async function validatePassword({
  email,
  password,
}: {
  email: AttendeeDocument["email"];
  password: string;
}) {
  const attendee = await Attendee.findOne({ email });

  if (!attendee) {
    return false;
  }

  const isValid = await attendee.comparePassword(password);

  if (!isValid) {
    return false;
  }

  return omit(attendee.toJSON(), "password");
}
