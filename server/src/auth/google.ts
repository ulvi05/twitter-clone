import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../mongoose/schema/user";
import { IUser } from "../types/user";
import { hashPassword } from "../utils/bcrypt";

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id).select(
    "-resetPasswordToken -resetPasswordTokenExpires"
  );
  if (!user) {
    return done(new Error("User not found"));
  }
  const userObj: IUser = user.toObject();
  delete userObj.password;
  done(null, userObj);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const googleId = profile.id;

        if (!googleId) {
          return done(new Error("Google ID is missing"), false);
        }
        if (!email) {
          return done(new Error("Google email is missing"), false);
        }

        let user = await User.findOne({ email });

        if (user) {
          if (!user.googleId) {
            user.googleId = googleId;
            await user.save();
          }
          return done(null, user);
        }
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = hashPassword(randomPassword);

        const newUser = new User({
          username: profile.displayName,
          fullName: profile.displayName,
          email,
          googleId,
          password: hashedPassword,
          profileImage: profile.photos?.[0].value,
        });

        await newUser.save();
        return done(null, newUser as IUser);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
