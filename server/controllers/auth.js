import User from "../models/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

// @desc Register a new user
// @route POST /register
// @access Public
const register = asyncHandler(async (req, res, next) => {
  const { username, email, country, img, city, phone, password } = req.body;

  // Validate request data
  if (!username || !email || !country || !city || !phone || !password) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided" });
  }

  // Check if the username or email already exist in the database
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    // If either username or email is found in the database, return an error response
    return res
      .status(404)
      .json({ message: "Username or email already exists" });
  }

  // If the username and email are unique, proceed with user creation
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const newUser = new User({
    username,
    email,
    country,
    img,
    city,
    phone,
    password: hash,
  });

  try {
    await newUser.save();
    res.status(200).send("User has been created.");
  } catch (err) {
    next(err);
  }
});

// @desc Login user
// @route POST /login
// @access Public
const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  // Validate request data
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Wrong password or username!" });
  }

  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT
  );

  const { password: _, isAdmin, ...otherDetails } = user._doc;
  res
    .cookie("access_token", token, {
      httpOnly: true,
    })
    .status(200)
    .json({ details: { ...otherDetails }, isAdmin });
});

// @desc Logout user
// @route POST /logout
// @access Private
const logout = asyncHandler(async (req, res, next) => {
  // Clear the access token cookie to log out the user
  res.clearCookie("access_token");
  res
    .status(200)
    .json({
      message: "User has been logged out successfully.",
      loggedOut: true,
    });
});
export { register, login, logout };
