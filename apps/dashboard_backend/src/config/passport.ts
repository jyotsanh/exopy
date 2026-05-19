import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { env } from "./env.js";
import { User } from "../models/user.model.js";
import { IUser } from "../models/types/index.js";

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

          // Check if user exists with Google ID
          const googleUser: IUser | null = await User.findOne({
            googleId: profile.id,
          });
          if (googleUser) {
           if(!googleUser.profile_image && profile.photos?.[0]?.value){
            googleUser.profile_image = profile.photos[0].value;
            await googleUser.save();
           }
            return done(null, googleUser);
          }

          // Check if user exists with same email
          if (email) {
            const isExistingUser: IUser | null = await User.findOne({
              email,
            });
            if (isExistingUser) {
              // Link Google account to existing user
              isExistingUser.googleId = profile.id;
              isExistingUser.profile_image = profile.photos?.[0]?.value || "";
              await isExistingUser.save();
              return done(null, isExistingUser);
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
