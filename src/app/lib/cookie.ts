import { Response } from "express";
import { isDev } from "../../config/env.config";

const cookieOptions = {
  httpOnly: true,
  secure: isDev,
  sameSite: "lax" as const,
};

export const setCookie = {
  accessToken(res: Response, token: string) {
    res.cookie("accessToken", token, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
  },

  refreshToken(res: Response, token: string) {
    res.cookie("refreshToken", token, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });
  },

  allTokens(res: Response, accessToken: string, refreshToken: string) {
    this.accessToken(res, accessToken);
    this.refreshToken(res, refreshToken);
  },

  clearCookies(res: Response) {
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
  },
};
