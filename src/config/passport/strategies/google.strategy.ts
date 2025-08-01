import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { eAuthMessages } from "../../../app/constants/messages";
import {
  eAuthProvider,
  eIsActive,
  eUserRoles,
} from "../../../app/modules/user/user.interface";
import { User } from "../../../app/modules/user/user.model";
import ENV from "../../env.config";

const GOOGLE = ENV.GOOGLE;

export const googleStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE.GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE.GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE.GOOGLE_CALLBACK_URL,
  },
  async (
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ) => {
    try {
      const email = profile.emails?.[0].value;

      if (!email) return done(null, false, { message: "Email not found" });

      let user = await User.findOne({ email });

      if (user) {
        if (user?.isDeleted)
          return done(null, false, { message: "User is deleted" });
        if (!user?.isVerified)
          return done(null, false, { message: "User is not verified" });
        if (user?.isActive === eIsActive.BLOCKED)
          return done(null, false, { message: "User is blocked" });
      }

      if (!user) {
        const fullName = profile.displayName || "";
        const [firstName, ...rest] = fullName.trim().split(" ");
        const lastName = rest.join(" ");

        user = await User.create({
          email,
          name: { firstName, lastName },
          picture: profile.photos?.[0].value || "",
          role: eUserRoles.SENDER,
          isVerified: true,
          auth: [
            {
              provider: eAuthProvider.google,
              providerId: email,
            },
          ],
        });

        return done(null, user, { message: eAuthMessages.CREATE_SUCCESS });
      }

      done(null, user, { message: eAuthMessages.LOGIN_SUCCESS });
    } catch (error) {
      return done(error);
    }
  }
);
