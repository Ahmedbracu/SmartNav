const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://ghostslayer2703_db_user:4gpMLhRtZUbhe91T@cluster0.jncdrq7.mongodb.net/smartnav?retryWrites=true&w=majority&appName=Cluster0";

const locationSchema = new mongoose.Schema({
  name: String, latitude: Number, longitude: Number, area_zone: String
});

async function addLocations() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected!");

  const Location = mongoose.models.Location || mongoose.model("Location", locationSchema);

  const newLocations = [
    // ═══════════════════════════════════════════════
    // MIRPUR & SURROUNDINGS
    // ═══════════════════════════════════════════════
    { name: "Mirpur-1", latitude: 23.7960, longitude: 90.3530, area_zone: "Mirpur" },
    { name: "Mirpur-2", latitude: 23.8010, longitude: 90.3570, area_zone: "Mirpur" },
    { name: "Mirpur-6", latitude: 23.8050, longitude: 90.3630, area_zone: "Mirpur" },
    { name: "Mirpur-10 Roundabout", latitude: 23.8073, longitude: 90.3690, area_zone: "Mirpur" },
    { name: "Mirpur-11", latitude: 23.8190, longitude: 90.3680, area_zone: "Mirpur" },
    { name: "Mirpur-12", latitude: 23.8240, longitude: 90.3750, area_zone: "Mirpur" },
    { name: "Mirpur-13", latitude: 23.8290, longitude: 90.3700, area_zone: "Mirpur" },
    { name: "Mirpur-14", latitude: 23.8330, longitude: 90.3770, area_zone: "Mirpur" },
    { name: "Shah Ali Bagh", latitude: 23.7930, longitude: 90.3490, area_zone: "Mirpur" },
    { name: "Kazipara", latitude: 23.7940, longitude: 90.3710, area_zone: "Mirpur" },
    { name: "Shewrapara", latitude: 23.7900, longitude: 90.3770, area_zone: "Mirpur" },
    { name: "ECB Chattar", latitude: 23.8130, longitude: 90.3630, area_zone: "Mirpur" },
    { name: "Matikata", latitude: 23.8180, longitude: 90.3590, area_zone: "Mirpur" },
    { name: "Mirpur DOHS", latitude: 23.8360, longitude: 90.3690, area_zone: "Mirpur" },
    { name: "Rupnagar", latitude: 23.7985, longitude: 90.3480, area_zone: "Mirpur" },
    { name: "Pirerbagh", latitude: 23.7940, longitude: 90.3430, area_zone: "Mirpur" },
    { name: "Kafrul", latitude: 23.7880, longitude: 90.3810, area_zone: "Mirpur" },
    { name: "Mirpur Zoo", latitude: 23.8130, longitude: 90.3490, area_zone: "Mirpur" },
    { name: "Botanical Garden", latitude: 23.8110, longitude: 90.3440, area_zone: "Mirpur" },
    { name: "Mirpur Stadium", latitude: 23.8068, longitude: 90.3630, area_zone: "Mirpur" },

    // ═══════════════════════════════════════════════
    // MOHAKHALI & SURROUNDINGS
    // ═══════════════════════════════════════════════
    { name: "Mohakhali Flyover", latitude: 23.7790, longitude: 90.4020, area_zone: "Mohakhali" },
    { name: "Mohakhali Bus Stand", latitude: 23.7770, longitude: 90.4045, area_zone: "Mohakhali" },
    { name: "Mohakhali DOHS", latitude: 23.7840, longitude: 90.3990, area_zone: "Mohakhali" },
    { name: "Wireless Gate", latitude: 23.7820, longitude: 90.4080, area_zone: "Mohakhali" },
    { name: "Niketan", latitude: 23.7790, longitude: 90.4110, area_zone: "Mohakhali" },
    { name: "Amtoli", latitude: 23.7740, longitude: 90.4060, area_zone: "Mohakhali" },
    { name: "Nabisco", latitude: 23.7760, longitude: 90.3990, area_zone: "Mohakhali" },

    // ═══════════════════════════════════════════════
    // MRT LINE-6 METRO STATIONS & SURROUNDINGS
    // ═══════════════════════════════════════════════
    { name: "Uttara North (Metro)", latitude: 23.8780, longitude: 90.3770, area_zone: "Metro Line-6" },
    { name: "Uttara Center (Metro)", latitude: 23.8700, longitude: 90.3785, area_zone: "Metro Line-6" },
    { name: "Uttara South (Metro)", latitude: 23.8620, longitude: 90.3800, area_zone: "Metro Line-6" },
    { name: "Pallabi (Metro)", latitude: 23.8270, longitude: 90.3645, area_zone: "Metro Line-6" },
    { name: "Mirpur-11 (Metro)", latitude: 23.8195, longitude: 90.3675, area_zone: "Metro Line-6" },
    { name: "Mirpur-10 (Metro)", latitude: 23.8075, longitude: 90.3695, area_zone: "Metro Line-6" },
    { name: "Kazipara (Metro)", latitude: 23.7945, longitude: 90.3715, area_zone: "Metro Line-6" },
    { name: "Shewrapara (Metro)", latitude: 23.7905, longitude: 90.3775, area_zone: "Metro Line-6" },
    { name: "Agargaon (Metro)", latitude: 23.7785, longitude: 90.3800, area_zone: "Metro Line-6" },
    { name: "Bijoy Sarani (Metro)", latitude: 23.7670, longitude: 90.3880, area_zone: "Metro Line-6" },
    { name: "Farmgate (Metro)", latitude: 23.7580, longitude: 90.3875, area_zone: "Metro Line-6" },
    { name: "Karwan Bazar (Metro)", latitude: 23.7520, longitude: 90.3935, area_zone: "Metro Line-6" },
    { name: "Shahbag (Metro)", latitude: 23.7390, longitude: 90.3960, area_zone: "Metro Line-6" },
    { name: "Dhaka University (Metro)", latitude: 23.7330, longitude: 90.3955, area_zone: "Metro Line-6" },
    { name: "Bangladesh Secretariat (Metro)", latitude: 23.7300, longitude: 90.4050, area_zone: "Metro Line-6" },
    { name: "Motijheel (Metro)", latitude: 23.7340, longitude: 90.4190, area_zone: "Metro Line-6" },

    // ═══════════════════════════════════════════════
    // PALLABI / RUPNAGAR SURROUNDINGS
    // ═══════════════════════════════════════════════
    { name: "Duaripara", latitude: 23.8310, longitude: 90.3620, area_zone: "Pallabi" },
    { name: "Ibrahimpur", latitude: 23.8240, longitude: 90.3580, area_zone: "Pallabi" },
    { name: "Bhasantek", latitude: 23.8370, longitude: 90.3610, area_zone: "Pallabi" },

    // ═══════════════════════════════════════════════
    // UTTARA SURROUNDINGS
    // ═══════════════════════════════════════════════
    { name: "Uttara Sector-3", latitude: 23.8680, longitude: 90.3740, area_zone: "Uttara" },
    { name: "Uttara Sector-7", latitude: 23.8730, longitude: 90.3850, area_zone: "Uttara" },
    { name: "Uttara Sector-10", latitude: 23.8810, longitude: 90.3870, area_zone: "Uttara" },
    { name: "Azampur", latitude: 23.8540, longitude: 90.3930, area_zone: "Uttara" },
    { name: "Diabari", latitude: 23.8910, longitude: 90.3760, area_zone: "Uttara" },

    // ═══════════════════════════════════════════════
    // GULSHAN / BANANI DEEPER
    // ═══════════════════════════════════════════════
    { name: "Gulshan Circle-1", latitude: 23.7810, longitude: 90.4155, area_zone: "Gulshan" },
    { name: "Gulshan Circle-2", latitude: 23.7935, longitude: 90.4150, area_zone: "Gulshan" },
    { name: "Banani Chairmanbari", latitude: 23.7950, longitude: 90.4020, area_zone: "Banani" },
    { name: "Banani Bazar", latitude: 23.7915, longitude: 90.4060, area_zone: "Banani" },
    { name: "Kakoli", latitude: 23.7890, longitude: 90.4050, area_zone: "Banani" },

    // ═══════════════════════════════════════════════
    // FARMGATE / TEJGAON AREA
    // ═══════════════════════════════════════════════
    { name: "Bijoy Sarani", latitude: 23.7665, longitude: 90.3885, area_zone: "Dhaka North" },
    { name: "Green Road", latitude: 23.7505, longitude: 90.3810, area_zone: "Dhaka South" },
    { name: "Tejgaon Industrial", latitude: 23.7640, longitude: 90.3960, area_zone: "Dhaka North" },
    { name: "Nakhalpara", latitude: 23.7710, longitude: 90.3920, area_zone: "Dhaka North" },
    { name: "Tejkunipara", latitude: 23.7680, longitude: 90.3850, area_zone: "Dhaka North" },

    // ═══════════════════════════════════════════════
    // OLD DHAKA / SOUTH
    // ═══════════════════════════════════════════════
    { name: "Lalbagh", latitude: 23.7190, longitude: 90.3880, area_zone: "Dhaka South" },
    { name: "Chawkbazar", latitude: 23.7230, longitude: 90.3960, area_zone: "Dhaka South" },
    { name: "Gulistan", latitude: 23.7280, longitude: 90.4100, area_zone: "Dhaka South" },
    { name: "Purana Paltan", latitude: 23.7350, longitude: 90.4150, area_zone: "Dhaka South" },
    { name: "Banglamotor", latitude: 23.7430, longitude: 90.3970, area_zone: "Dhaka South" },
    { name: "Science Lab", latitude: 23.7350, longitude: 90.3830, area_zone: "Dhaka South" },
    { name: "Elephant Road", latitude: 23.7370, longitude: 90.3860, area_zone: "Dhaka South" },
    { name: "Dhaka University", latitude: 23.7330, longitude: 90.3950, area_zone: "Dhaka South" },
    { name: "Buet", latitude: 23.7270, longitude: 90.3920, area_zone: "Dhaka South" },
  ];

  let added = 0;
  for (const loc of newLocations) {
    const exists = await Location.findOne({ name: loc.name });
    if (!exists) {
      await Location.create(loc);
      added++;
    }
  }

  const total = await Location.countDocuments();
  console.log(`Added ${added} new locations. Total in database: ${total}`);
  await mongoose.disconnect();
}

addLocations().catch(console.error);
