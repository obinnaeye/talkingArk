import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import config from "config";

const requiresAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  if (accessToken !== config.get("adminToken")) {
    return res.sendStatus(403);
  }

  return next();
};

export default requiresAdmin;
