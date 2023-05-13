import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { AttendeeDocument } from "./attendee.model";
import { TalkDocument } from "./talk.model";

export interface TalkMessageDocument extends mongoose.Document {
  attendee: AttendeeDocument["_id"];
  talk: TalkDocument["_id"];
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const TalkMessageSchema = new mongoose.Schema(
  {
    talkMessageId: {
      type: String,
      required: true,
      unique: true,
      default: () => nanoid(10),
    },
    attendee: { type: mongoose.Schema.Types.ObjectId, ref: "Attendee" },
    talk: { type: mongoose.Schema.Types.ObjectId, ref: "Talk" },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const TalkMessage = mongoose.model<TalkMessageDocument>("TalkMessage", TalkMessageSchema);

export default TalkMessage;
