// authController.js
exports.googleAuthCallback = (req, res) => {
  passport.authenticate("google", { failureRedirect: "/" })(req, res, (err) => {
    if (err) {
      console.error("Google authentication error:", err);
      return res.redirect("/"); // or handle the error appropriately
    }

    console.log("Google authentication successful");
    res.redirect("/");
  });
};
