const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = "mongodb+srv://ghostslayer2703_db_user:4gpMLhRtZUbhe91T@cluster0.jncdrq7.mongodb.net/smartnav?retryWrites=true&w=majority&appName=Cluster0";

const locationSchema = new mongoose.Schema({
  name: String, latitude: Number, longitude: Number, area_zone: String
});
const transportSchema = new mongoose.Schema({
  type: String, average_speed: Number, base_fare: Number
});
const userSchema = new mongoose.Schema({
  name: String, email: String, password_hash: String, role: String, preferences: Object, created_at: Date
});

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB Atlas!");

  const Location = mongoose.models.Location || mongoose.model("Location", locationSchema);
  const TransportMode = mongoose.models.TransportMode || mongoose.model("TransportMode", transportSchema);
  const User = mongoose.models.User || mongoose.model("User", userSchema);

  // ── CLEAR EXISTING DATA ──
  await Location.deleteMany({});
  await TransportMode.deleteMany({});
  console.log("Cleared old data.");

  // ── SEED DHAKA LOCATIONS (Real GPS Coordinates) ──
  const locations = [
    { name: "Motijheel", latitude: 23.7339, longitude: 90.4185, area_zone: "Dhaka South" },
    { name: "Gulshan-1", latitude: 23.7813, longitude: 90.4161, area_zone: "Dhaka North" },
    { name: "Gulshan-2", latitude: 23.7934, longitude: 90.4147, area_zone: "Dhaka North" },
    { name: "Banani", latitude: 23.7938, longitude: 90.4035, area_zone: "Dhaka North" },
    { name: "Dhanmondi", latitude: 23.7461, longitude: 90.3742, area_zone: "Dhaka South" },
    { name: "Uttara", latitude: 23.8759, longitude: 90.3795, area_zone: "Dhaka North" },
    { name: "Mirpur-10", latitude: 23.8068, longitude: 90.3687, area_zone: "Dhaka North" },
    { name: "Farmgate", latitude: 23.7575, longitude: 90.3870, area_zone: "Dhaka South" },
    { name: "Shahbag", latitude: 23.7387, longitude: 90.3958, area_zone: "Dhaka South" },
    { name: "Mohakhali", latitude: 23.7783, longitude: 90.4056, area_zone: "Dhaka North" },
    { name: "Tejgaon", latitude: 23.7626, longitude: 90.3984, area_zone: "Dhaka North" },
    { name: "Karwan Bazar", latitude: 23.7516, longitude: 90.3930, area_zone: "Dhaka South" },
    { name: "New Market", latitude: 23.7337, longitude: 90.3845, area_zone: "Dhaka South" },
    { name: "Sadarghat", latitude: 23.7081, longitude: 90.4070, area_zone: "Dhaka South" },
    { name: "Jatrabari", latitude: 23.7104, longitude: 90.4348, area_zone: "Dhaka South" },
    { name: "Badda", latitude: 23.7807, longitude: 90.4268, area_zone: "Dhaka North" },
    { name: "Rampura", latitude: 23.7618, longitude: 90.4263, area_zone: "Dhaka South" },
    { name: "Khilgaon", latitude: 23.7454, longitude: 90.4338, area_zone: "Dhaka South" },
    { name: "Bashundhara R/A", latitude: 23.8143, longitude: 90.4275, area_zone: "Dhaka North" },
    { name: "Mohammadpur", latitude: 23.7662, longitude: 90.3586, area_zone: "Dhaka South" },
    { name: "Shyamoli", latitude: 23.7745, longitude: 90.3650, area_zone: "Dhaka North" },
    { name: "Agargaon", latitude: 23.7782, longitude: 90.3790, area_zone: "Dhaka North" },
    { name: "Pallabi", latitude: 23.8275, longitude: 90.3650, area_zone: "Dhaka North" },
    { name: "Gabtoli", latitude: 23.7820, longitude: 90.3465, area_zone: "Dhaka North" },
    { name: "Airport", latitude: 23.8513, longitude: 90.4086, area_zone: "Dhaka North" },
  ];
  await Location.insertMany(locations);
  console.log(`Seeded ${locations.length} Dhaka locations with GPS coordinates!`);

  // ── SEED TRANSPORT MODES ──
  const transports = [
    { type: "Bus", average_speed: 15, base_fare: 8 },
    { type: "CNG Auto", average_speed: 20, base_fare: 30 },
    { type: "Rickshaw", average_speed: 8, base_fare: 20 },
    { type: "Metro Rail", average_speed: 35, base_fare: 20 },
    { type: "Ride Share", average_speed: 25, base_fare: 50 },
    { type: "Tempo", average_speed: 12, base_fare: 10 },
    { type: "Water Bus", average_speed: 18, base_fare: 15 },
  ];
  await TransportMode.insertMany(transports);
  console.log(`Seeded ${transports.length} transport modes!`);

  // ── CREATE ADMIN USER ──
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await User.findOneAndUpdate(
    { email: "admin@smartnav.com" },
    {
      name: "SmartNav Admin",
      email: "admin@smartnav.com",
      password_hash: hashedPassword,
      role: "admin",
      preferences: { theme: 'system', language: 'en', notifications: true },
      created_at: new Date()
    },
    { upsert: true, new: true }
  );
  console.log("Admin user created/updated (admin@smartnav.com / admin123)");

  await mongoose.disconnect();
  console.log("\nDone! Your database is now fully seeded.");
}

seed().catch(console.error);
