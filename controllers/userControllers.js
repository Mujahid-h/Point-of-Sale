const userModel = require("../models/userModel");

// Login User
const loginControler = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await userModel.findOne({ userId, password, verified: true });
    if (user) {
      res.status(200).send(user);
    } else {
      res.json({
        message: "Login Failed",
        user,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// Register User
const registerController = async (req, res) => {
  try {
    const newUser = new userModel({ ...req.body, verified: true });
    await newUser.save();
    res.status(201).send("New User added Successfully!");
  } catch (error) {
    res.status(400).send({ error: error.message });
    console.log(error);
  }
};

module.exports = {
  loginControler,
  registerController,
};
