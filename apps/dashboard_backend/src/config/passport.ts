import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { env } from "./env.js";
import { User } from "../models/user.model.js";
import { IUser } from "../models/types/index.js";
import { Role } from "../constants/enum.js";

const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile: Profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;

          const googleUser: IUser | null = await User.findOne({
            googleId: profile.id,
            is_deleted: false,
          });
          if (googleUser) {
            if (
              googleUser.role !== Role.SUPERADMIN &&
              googleUser.role !== Role.ADMIN
            ) {
              return done(null, false);
            }
            if (!googleUser.profile_image && profile.photos?.[0]?.value) {
              googleUser.profile_image = profile.photos[0].value;
              await googleUser.save();
            }
            return done(null, googleUser);
          }

          if (email) {
            const existingUser: IUser | null = await User.findOne({
              email,
              is_deleted: false,
            });
            if (existingUser) {
              if (
                existingUser.role !== Role.SUPERADMIN &&
                existingUser.role !== Role.ADMIN
              ) {
                return done(null, false);
              }
              existingUser.googleId = profile.id;
              if (!existingUser.profile_image && profile.photos?.[0]?.value) {
                existingUser.profile_image = profile.photos[0].value;
              }
              await existingUser.save();
              return done(null, existingUser);
            }
          }

          return done(null, false);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};

export default configurePassport;
