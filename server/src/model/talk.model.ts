import mongoose from "mongoose";
import { nanoid } from "nanoid";

export interface TalkDocument extends mongoose.Document {
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const TalkSchema = new mongoose.Schema(
  {
    talkId: {
      type: String,
      required: true,
      unique: true,
      default: () => nanoid(10),
    },
    title: { type: String, required: true },
    description: { type: String, required: false },
  },
  { timestamps: true }
);

const Talk = mongoose.model<TalkDocument>("Talk", TalkSchema);

export default Talk;
