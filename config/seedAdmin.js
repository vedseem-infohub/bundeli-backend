import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

/**
 * Ensures master admin account exists in the database
 */
export const seedDefaultAdmin = async () => {
  try {
    const defaultEmail = (
      process.env.DEFAULT_ADMIN_EMAIL || "admin@bundelikalavrat.com"
    )
      .toLowerCase()
      .trim();
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || "Admin@Kalavrat2026";

    const adminUser = await User.findOne({ email: defaultEmail });

    if (!adminUser) {
      console.log(`Seeding master superadmin (${defaultEmail})...`);
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      await User.create({
        name: "Bundeli Royal Atelier Master",
        email: defaultEmail,
        password: hashedPassword,
        role: "superadmin",
        phone: "+91 76862 88411",
        isActive: true,
      });
      console.log(`Master Superadmin account verified and active!`);
    } else if (adminUser.role !== "superadmin") {
      adminUser.role = "superadmin";
      adminUser.isActive = true;
      await adminUser.save();
    }
  } catch (error) {
    console.error("Failed to seed default admin:", error?.message || error);
  }
};

export default seedDefaultAdmin;
