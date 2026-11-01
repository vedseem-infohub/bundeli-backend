import User from "../models/user.model.js";
import Selection from "../models/selection.model.js";
import bcrypt from "bcryptjs";

// @desc    Get currently authenticated user
// @route   GET /api/user/current
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching user profile", error: error.message });
  }
};

// @desc    Get all registered users & patrons (Admin)
// @route   GET /api/user/all
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch users", error: error.message });
  }
};

// @desc    Create a new admin / curator user (Admin)
// @route   POST /api/user/create-admin
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role = "admin", phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A user account with this email already exists.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const validRoles = ["admin", "superadmin", "curator"];
    const assignedRole = validRoles.includes(role) ? role : "admin";

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: assignedRole,
      phone: phone || "",
    });

    const safeAdmin = newAdmin.toObject();
    delete safeAdmin.password;

    return res.status(201).json({
      success: true,
      message: `Admin account (${assignedRole}) created successfully.`,
      user: safeAdmin,
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    return res.status(500).json({ success: false, message: "Failed to create admin", error: error.message });
  }
};

// @desc    Update user role (e.g. promote user to admin or curator)
// @route   PUT /api/user/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ["user", "admin", "superadmin", "curator"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Allowed roles: ${validRoles.join(", ")}`,
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.role = role;
    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(200).json({
      success: true,
      message: `User role successfully updated to ${role}.`,
      user: safeUser,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({ success: false, message: "Failed to update role", error: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/user/:id
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ success: false, message: "Failed to delete user", error: error.message });
  }
};

// @desc    Save user artwork selection (commission inquiry)
// @route   POST /api/user/selections
export const saveSelection = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      userPhone,
      artworkId,
      artworkTitle,
      artworkSlug,
      artworkImage,
      artist,
      category,
      price,
      channel,
      customDimensions,
      notes,
    } = req.body;

    if (!artworkId || !artworkTitle) {
      return res.status(400).json({
        success: false,
        message: "Artwork ID and Title are required.",
      });
    }

    // 1. Create entry in Selection collection
    const selection = await Selection.create({
      user: userId || req.userId || null,
      userName: userName || "Patron Collector",
      userEmail: userEmail || "",
      userPhone: userPhone || "",
      artworkId,
      artworkTitle,
      artworkSlug: artworkSlug || "",
      artworkImage: artworkImage || "",
      artist: artist || "Bundeli Master Atelier",
      category: category || "",
      price: price ? Number(price) : 0,
      channel: channel || "Direct Selection",
      customDimensions: customDimensions || "",
      notes: notes || "",
      status: "Selected",
    });

    // 2. Also append to User document if authenticated
    const targetUserId = userId || req.userId;
    if (targetUserId) {
      await User.findByIdAndUpdate(targetUserId, {
        $push: {
          selectedArtworks: {
            artworkId,
            title: artworkTitle,
            slug: artworkSlug,
            image: artworkImage,
            category,
            price: price ? Number(price) : 0,
            artist,
            status: "Selected",
            notes: notes || "",
          },
        },
      });
    }

    return res.status(201).json({
      success: true,
      message: "Artwork selection recorded successfully",
      selection,
    });
  } catch (error) {
    console.error("Error saving selection:", error);
    return res.status(500).json({ success: false, message: "Failed to record selection", error: error.message });
  }
};

// @desc    Get all artwork selections (Admin view to see what users select)
// @route   GET /api/user/selections
export const getAllSelections = async (req, res) => {
  try {
    const selections = await Selection.find()
      .populate("user", "name email phone role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: selections.length,
      selections,
    });
  } catch (error) {
    console.error("Error fetching selections:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch selections", error: error.message });
  }
};

// @desc    Update selection commission status
// @route   PUT /api/user/selections/:id/status
export const updateSelectionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const selection = await Selection.findById(id);
    if (!selection) {
      return res.status(404).json({ success: false, message: "Selection not found" });
    }

    if (status) selection.status = status;
    if (notes !== undefined) selection.notes = notes;

    await selection.save();

    return res.status(200).json({
      success: true,
      message: "Selection status updated successfully",
      selection,
    });
  } catch (error) {
    console.error("Error updating selection status:", error);
    return res.status(500).json({ success: false, message: "Failed to update status", error: error.message });
  }
};

// @desc    Delete a selection record
// @route   DELETE /api/user/selections/:id
export const deleteSelection = async (req, res) => {
  try {
    const { id } = req.params;
    const selection = await Selection.findByIdAndDelete(id);

    if (!selection) {
      return res.status(404).json({ success: false, message: "Selection not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Selection record deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting selection:", error);
    return res.status(500).json({ success: false, message: "Failed to delete selection", error: error.message });
  }
};
