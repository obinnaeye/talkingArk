import mongoose from "mongoose";
import { nanoid } from "nanoid";

export interface TalkAttendeeDocument extends mongoose.Document {
  attendee: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const TalkAttendeeSchema = new mongoose.Schema(
  {
    talkAttendeeId: {
      type: String,
      required: true,
      unique: true,
      default: () => nanoid(10),
    },
    attendee: { type: String, required: true },
    title: {type: String, required: true},
  },
  { timestamps: true }
);

const TalkAttendee = mongoose.model<TalkAttendeeDocument>("TalkAttendee", TalkAttendeeSchema);

export default TalkAttendee;
