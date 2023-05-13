import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

export interface AttendeeDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AttendeeSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    isApproved: {type: Boolean, default: false }
  },
  { timestamps: true }
);

AttendeeSchema.pre("save", async function (next: mongoose.HookNextFunction) {
  let attendee = this as AttendeeDocument;

  if (!attendee.isModified("password")) return next();

  const salt = await bcrypt.genSalt(config.get("saltWorkFactor"));
  const hash = bcrypt.hashSync(attendee.password, salt);
  attendee.password = hash;

  return next();
});

AttendeeSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const attendee = this as AttendeeDocument;

  return bcrypt.compare(candidatePassword, attendee.password).catch((e) => false);
};

const Attendee = mongoose.model<AttendeeDocument>("Attendee", AttendeeSchema);

export default Attendee;
