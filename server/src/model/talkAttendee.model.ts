import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { AttendeeDocument } from "./attendee.model";
import { TalkDocument } from "./talk.model";

export interface TalkAttendeeDocument extends mongoose.Document {
  attendee: AttendeeDocument["_id"];
  talk: TalkDocument["_id"];
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
    attendee: { type: mongoose.Schema.Types.ObjectId, ref: "Attendee" },
    talk: { type: mongoose.Schema.Types.ObjectId, ref: "Talk" },
  },
  { timestamps: true }
);

const TalkAttendee = mongoose.model<TalkAttendeeDocument>("TalkAttendee", TalkAttendeeSchema);

export default TalkAttendee;
