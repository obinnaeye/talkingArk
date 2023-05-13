import { get } from "lodash";
import { Request, Response, NextFunction } from "express";

const requiresAttendee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const attendee = get(req, "attendee");

  if (!attendee) {
    return res.sendStatus(403);
  }

  return next();
};

export default requiresAttendee;
