const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Copy your exact MongoDB URI from .env.local here:
const MONGODB_URI = "mongodb+srv://ghostslayer2703_db_user:4gpMLhRtZUbhe91T@cluster0.jncdrq7.mongodb.net/smartnav?retryWrites=true&w=majority&appName=Cluster0";

// CHANGE THESE TO YOUR PREFERRED ADMIN CREDENTIALS
const ADMIN_NAME = "Ahmed Ibn Belal";
const ADMIN_EMAIL = "ahmedabubakar.official@gmail.com"; // <--- Put your actual email here
const ADMIN_PASSWORD = "KyaAdminBanegaReTu0?"; // <--- Put your actual password here

async function createAdmin() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    // Define User Schema inline to avoid TS module issues in JS script
    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      password_hash: String,
      role: String,
      preferences: Object,
      created_at: Date
    });
    
    // Use existing model or create new
    const User = mongoose.models.User || mongoose.model("User", userSchema);

    // Check if user already exists
    const existingUser = await User.findOne({ email: ADMIN_EMAIL });
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    if (existingUser) {
      console.log(`User ${ADMIN_EMAIL} already exists. Upgrading to Admin...`);
      existingUser.role = "admin";
      existingUser.password_hash = hashedPassword;
      await existingUser.save();
      console.log("SUCCESS: Existing user upgraded to Admin!");
    } else {
      console.log(`Creating new Admin user: ${ADMIN_EMAIL}...`);
      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password_hash: hashedPassword,
        role: "admin",
        preferences: { theme: 'system', language: 'en', notifications: true },
        created_at: new Date()
      });
      console.log("SUCCESS: New Admin account created!");
    }

  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

createAdmin();
