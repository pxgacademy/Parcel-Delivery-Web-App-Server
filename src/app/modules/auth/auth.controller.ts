import passport from "passport";
import ENV from "../../../config/env.config";
import { AppError } from "../../../errors/AppError";
import sCode from "../../../statusCode";
import { catchAsync } from "../../lib/catchAsync";
import { setCookie } from "../../lib/cookie";
import {
  generateAccessTokenByRefreshToken,
  generateAllTokens,
} from "../../lib/jwt";
import { sendResponse } from "../../utils/sendResponse";
import {
  changePasswordService,
  credentialLoginService,
  forgotPasswordService,
  resetPasswordService,
  setPasswordService,
} from "./auth.service";

//
export const credentialLoginController = catchAsync(async (req, res) => {
  const { data: user } = await credentialLoginService(req.body);

  const { accessToken, refreshToken } = generateAllTokens(user);
  setCookie.allTokens(res, accessToken, refreshToken);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "User logged in successfully",
    data: user,
  });
});

//
export const googleLoginUserController = catchAsync(async (req, res) => {
  const { redirect } = req.query || "/";

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: redirect as string,
  })(req, res);
});

//
export const googleCallbackController = catchAsync(async (req, res) => {
  const redirectTo = req.query?.state || "";

  const user = req.user;
  if (!user) throw new AppError(sCode.NOT_FOUND, "User not found!");

  const { accessToken, refreshToken } = generateAllTokens(user);
  setCookie.allTokens(res, accessToken, refreshToken);

  res.redirect(`${ENV.FRONTEND_URL}${redirectTo}`);
});

//
export const getNewAccessTokenController = catchAsync(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken)
    throw new AppError(sCode.BAD_REQUEST, "Refresh token not found");
  const token = await generateAccessTokenByRefreshToken(refreshToken);
  setCookie.accessToken(res, token);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "New access token retrieved successfully",
    data: token,
  });
});

//
export const userLogoutController = catchAsync(async (req, res) => {
  setCookie.clearCookies(res);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "User logged out successfully",
  });
});

//
export const changePasswordController = catchAsync(async (req, res) => {
  const password = await changePasswordService(req);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Password updated successfully",
    data: password,
  });
});

//
export const forgotPasswordController = catchAsync(async (req, res) => {
  const { email } = req.body;
  await forgotPasswordService(email);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Email sent successfully",
  });
});

//
export const resetPasswordController = catchAsync(async (req, res) => {
  const data = await resetPasswordService(req);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Password updated successfully",
    data,
  });
});

//
export const setPasswordController = catchAsync(async (req, res) => {
  const password = await setPasswordService(req);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Password updated successfully",
    data: password,
  });
});
