import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";

// Rest of the code for the User Schema and imports remains the same

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.status(200).json(users);
});

// @desc Update a user
// @route PATCH /users/:id
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, email, country, img, city, phone, password, isAdmin } =
    req.body;

  // Confirm data
  if (!id || !username || !email || !country || !city || !phone) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided" });
  }

  try {
    const user = await User.findById(id).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check for duplicate username and email
    const duplicateUsername = await User.findOne({ username, _id: { $ne: id } })
      .lean()
      .exec();
    const duplicateEmail = await User.findOne({ email, _id: { $ne: id } })
      .lean()
      .exec();

    if (duplicateUsername) {
      return res.status(409).json({ message: "Username already exists" });
    }

    if (duplicateEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Update user fields
    user.username = username;
    user.email = email;
    user.country = country;
    user.img = img;
    user.city = city;
    user.phone = phone;

    if (password) {
      // Hash password
      user.password = await bcrypt.hash(password, 10); // salt rounds
    }

    if (isAdmin !== undefined) {
      user.isAdmin = isAdmin;
    }

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.username} updated` });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// @desc Delete a user
// @route DELETE /users/:id
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  // Does the user exist to delete?
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result._id} deleted`;

  res.json(reply);
});

const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  const user = await User.findById(id).select("-password").lean().exec();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});

export { getUser, getAllUsers, updateUser, deleteUser };
