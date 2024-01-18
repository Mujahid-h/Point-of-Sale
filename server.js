const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
require("colors");
const connectDB = require("./config/config");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const expressSession = require("express-session");

// dotenv Config
dotenv.config();

// MongoDB Connection
connectDB();

// google authentication
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/api/auth/google/callback",
      prompt: "select_account",
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log("Google authentication triggered."); // Add this line

      try {
        const existingUser = await Users.findOne({ googleId: profile.id });

        if (existingUser) {
          // User already exists, update any necessary fields
          existingUser.googleDisplayName = profile.displayName;
          existingUser.googleEmail = profile.emails[0].value;

          await existingUser.save();
          return done(null, existingUser);
        }

        // User doesn't exist, create a new user
        const newUser = new Users({
          googleId: profile.id,
          googleDisplayName: profile.displayName,
          googleEmail: profile.emails[0].value,
          name: profile.displayName, // You can adjust this based on your use case
          // Other fields as needed
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// rest object
const app = express();

/// middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Use express-session before initializing Passport
app.use(
  expressSession({
    secret: "abcABC@:9211balkay12nahi13!,",
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport after express-session
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

app.use((req, res, next) => {
  console.log("Session:", req.session);
  console.log("User:", req.user);
  next();
});

// routes
app.use("/api/items", require("./routes/itemRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/bills", require("./routes/billRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

// port
const PORT = 8080;

// listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`.bgCyan.white);
});
