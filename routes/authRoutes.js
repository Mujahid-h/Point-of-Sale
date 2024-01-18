// routes/authRoutes.js
const express = require("express");
const passport = require("passport");
const router = express.Router();
const { googleAuthCallback } = require("../controllers/authController");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback", googleAuthCallback);

// authRoutes.js
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
