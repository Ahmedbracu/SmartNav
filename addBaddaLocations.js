const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://ghostslayer2703_db_user:4gpMLhRtZUbhe91T@cluster0.jncdrq7.mongodb.net/smartnav?retryWrites=true&w=majority&appName=Cluster0";

const locationSchema = new mongoose.Schema({
  name: String, latitude: Number, longitude: Number, area_zone: String
});

async function addBaddaLocations() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected!");

  const Location = mongoose.models.Location || mongoose.model("Location", locationSchema);

  const newLocations = [
    // Badda & surroundings
    { name: "Badda Link Road", latitude: 23.7815, longitude: 90.4290, area_zone: "Badda" },
    { name: "Merul Badda", latitude: 23.7780, longitude: 90.4310, area_zone: "Badda" },
    { name: "Middle Badda", latitude: 23.7830, longitude: 90.4255, area_zone: "Badda" },
    { name: "Uttar Badda", latitude: 23.7870, longitude: 90.4280, area_zone: "Badda" },
    { name: "DIT Road Badda", latitude: 23.7795, longitude: 90.4245, area_zone: "Badda" },
    { name: "Shahjadpur", latitude: 23.7905, longitude: 90.4210, area_zone: "Badda" },
    { name: "Aftab Nagar", latitude: 23.7690, longitude: 90.4350, area_zone: "Badda" },
    { name: "Satarkul", latitude: 23.7730, longitude: 90.4420, area_zone: "Badda" },

    // Nearby areas
    { name: "Hatirjheel", latitude: 23.7720, longitude: 90.4130, area_zone: "Dhaka South" },
    { name: "Notun Bazar", latitude: 23.7960, longitude: 90.4220, area_zone: "Dhaka North" },
    { name: "Joar Sahara", latitude: 23.8020, longitude: 90.4240, area_zone: "Dhaka North" },
    { name: "Baridhara", latitude: 23.7990, longitude: 90.4180, area_zone: "Dhaka North" },
    { name: "Nadda", latitude: 23.8090, longitude: 90.4290, area_zone: "Dhaka North" },
    { name: "Kuril", latitude: 23.8200, longitude: 90.4220, area_zone: "Dhaka North" },
    { name: "Pragati Sarani", latitude: 23.8130, longitude: 90.4170, area_zone: "Dhaka North" },
    { name: "Nurerchala", latitude: 23.8060, longitude: 90.4350, area_zone: "Dhaka North" },
    { name: "Gulshan Link Road", latitude: 23.7870, longitude: 90.4140, area_zone: "Dhaka North" },
  ];

  let added = 0;
  for (const loc of newLocations) {
    const exists = await Location.findOne({ name: loc.name });
    if (!exists) {
      await Location.create(loc);
      added++;
      console.log(`  + Added: ${loc.name}`);
    } else {
      console.log(`  ✓ Already exists: ${loc.name}`);
    }
  }

  console.log(`\nDone! Added ${added} new locations.`);
  await mongoose.disconnect();
}

addBaddaLocations().catch(console.error);
