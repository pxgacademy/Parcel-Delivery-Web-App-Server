import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../errors/AppError";
import { verifyAccessToken } from "../lib/jwt";
import { eIsActive } from "../modules/user/user.interface";
import { extractTokenFromHeader } from "../utils/extractTokenFromHeader";

export const userAccessVerifier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers?.authorization || "";
    const decoded = verifyAccessToken(
      extractTokenFromHeader(header)
    ) as JwtPayload;

    const { isDeleted, isVerified, isActive } = decoded;

    if (isDeleted) return next(new AppError(400, "User is deleted"));
    if (!isVerified) return next(new AppError(400, "User is not verified"));
    if (isActive === eIsActive.BLOCKED)
      return next(new AppError(400, "User is blocked"));

    req.decoded = decoded;

    next();
  } catch (error) {
    next(error);
  }
};
