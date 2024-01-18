const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
    },
    googleId: {
      type: String,
    },
    googleDisplayName: {
      type: String,
    },
    googleEmail: {
      type: String,
    },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
