import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields (name, email, password) are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existEmail = await User.findOne({ email: normalizedEmail });
    if (existEmail) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      password: hashedPassword,
      email: normalizedEmail,
      role: "user",
    });

    const token = await genToken(user._id);

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });

    return res.status(201).json({
      message: "Collector account created successfully.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: "user",
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: `Registration error: ${error.message || error}` });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "No account found with this email." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password. Please verify and try again." });
    }

    const token = await genToken(user._id);

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });

    return res.status(200).json({
      message: "Welcome back! Signed in successfully.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: `Sign in error: ${error.message || error}` });
  }
};

/**
 * Strict Admin Login API
 * Validates credentials and strictly requires role to be "admin", "superadmin", or "curator"
 */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both administrative email and password.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find account
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Access Denied: Invalid administrative credentials.",
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Access Denied: Invalid administrative credentials.",
      });
    }

    // Strict Role Verification: Must be in authorized admin roles
    const allowedAdminRoles = ["admin", "superadmin", "curator"];
    if (!user.role || !allowedAdminRoles.includes(user.role)) {
      console.warn(`Unauthorized admin login attempt by user ${user.email} with role "${user.role}"`);
      return res.status(403).json({
        success: false,
        message: "Forbidden: This account does not possess Royal Atelier administration credentials.",
      });
    }

    // Check account active state
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Administrative privileges for this account have been suspended.",
      });
    }

    // Generate JWT
    const token = await genToken(user._id);

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });

    return res.status(200).json({
      success: true,
      message: `Welcome, ${user.name}. Authenticated as Atelier ${user.role.toUpperCase()}.`,
      token,
      admin: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || "",
        avatar: user.avatar || "",
      },
    });
  } catch (error) {
    console.error("Strict admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during administrative authentication.",
      error: error.message,
    });
  }
};

/**
 * Verify active admin session
 */
export const getAdminProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Administrative session expired." });
    }

    const allowedAdminRoles = ["admin", "superadmin", "curator"];
    if (!user.role || !allowedAdminRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access Denied: Account lacks administrative privileges.",
      });
    }

    return res.status(200).json({
      success: true,
      admin: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || "",
        mobileNo: user.mobileNo || user.phone || "",
        whatsappNo: user.whatsappNo || "",
        atelierTitle: user.atelierTitle || "Bundeli Royal Atelier Master & Senior Conservator",
        bio: user.bio || "",
        address: user.address || {
          street: "",
          city: "Orchha",
          state: "Madhya Pradesh",
          pincode: "472246",
          country: "India",
        },
        socialLinks: user.socialLinks || {
          instagram: "",
          facebook: "",
          twitter: "",
          youtube: "",
          linkedin: "",
          pinterest: "",
          website: "",
        },
        avatar: user.avatar || "",
      },
    });
  } catch (error) {
    console.error("Verify admin error:", error);
    return res.status(500).json({ success: false, message: "Session check failed", error: error.message });
  }
};

/**
 * Update authenticated admin's personal & atelier contact info
 */
export const updateAdminProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "Admin user not found." });
    }

    const allowedAdminRoles = ["admin", "superadmin", "curator"];
    if (!user.role || !allowedAdminRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access Denied: Account lacks administrative privileges.",
      });
    }

    const {
      name,
      email,
      phone,
      mobileNo,
      whatsappNo,
      atelierTitle,
      bio,
      address,
      socialLinks,
      currentPassword,
      newPassword,
    } = req.body;

    // 1. Email uniqueness check if changing email
    if (email && email.toLowerCase().trim() !== user.email) {
      const normalizedEmail = email.toLowerCase().trim();
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "Another user account is already registered with this email address.",
        });
      }
      user.email = normalizedEmail;
    }

    // 2. Basic info
    if (name && name.trim()) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (mobileNo !== undefined) user.mobileNo = mobileNo.trim();
    if (whatsappNo !== undefined) user.whatsappNo = whatsappNo.trim();
    if (atelierTitle !== undefined) user.atelierTitle = atelierTitle.trim();
    if (bio !== undefined) user.bio = bio.trim();

    // 3. Address
    if (address && typeof address === "object") {
      user.address = {
        street: address.street !== undefined ? address.street.trim() : (user.address?.street || ""),
        city: address.city !== undefined ? address.city.trim() : (user.address?.city || "Orchha"),
        state: address.state !== undefined ? address.state.trim() : (user.address?.state || "Madhya Pradesh"),
        pincode: address.pincode !== undefined ? address.pincode.trim() : (user.address?.pincode || "472246"),
        country: address.country !== undefined ? address.country.trim() : (user.address?.country || "India"),
      };
    }

    // 4. Social Media Links
    if (socialLinks && typeof socialLinks === "object") {
      user.socialLinks = {
        instagram: socialLinks.instagram !== undefined ? socialLinks.instagram.trim() : (user.socialLinks?.instagram || ""),
        facebook: socialLinks.facebook !== undefined ? socialLinks.facebook.trim() : (user.socialLinks?.facebook || ""),
        twitter: socialLinks.twitter !== undefined ? socialLinks.twitter.trim() : (user.socialLinks?.twitter || ""),
        youtube: socialLinks.youtube !== undefined ? socialLinks.youtube.trim() : (user.socialLinks?.youtube || ""),
        linkedin: socialLinks.linkedin !== undefined ? socialLinks.linkedin.trim() : (user.socialLinks?.linkedin || ""),
        pinterest: socialLinks.pinterest !== undefined ? socialLinks.pinterest.trim() : (user.socialLinks?.pinterest || ""),
        website: socialLinks.website !== undefined ? socialLinks.website.trim() : (user.socialLinks?.website || ""),
      };
    }

    // 5. Password update if requested
    if (newPassword && newPassword.trim()) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is required to change password.",
        });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password verification failed.",
        });
      }
      if (newPassword.trim().length < 6) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 6 characters long.",
        });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword.trim(), salt);
    }

    await user.save();

    const safeAdmin = {
      id: user._id,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || "",
      mobileNo: user.mobileNo || user.phone || "",
      whatsappNo: user.whatsappNo || "",
      atelierTitle: user.atelierTitle || "",
      bio: user.bio || "",
      address: user.address || {},
      socialLinks: user.socialLinks || {},
      avatar: user.avatar || "",
      updatedAt: user.updatedAt,
    };

    return res.status(200).json({
      success: true,
      message: "Atelier administrative profile updated successfully.",
      admin: safeAdmin,
    });
  } catch (error) {
    console.error("Error updating admin profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
      error: error.message,
    });
  }
};

export const logOut = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });
    return res.status(200).json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ success: false, message: `Logout error: ${error.message || error}` });
  }
};
