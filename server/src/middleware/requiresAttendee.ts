import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import config from "config";

const requiresAttendee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  if (accessToken === config.get("adminToken")) {
    return next();
  }
  const attendee = get(req, "attendee");

  if (!attendee) {
    return res.sendStatus(403);
  }

  return next();
};

export default requiresAttendee;
