const fs = require('fs');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Read .env.local for MONGODB_URI
const envPath = '.env.local';
let MONGODB_URI = '';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/MONGODB_URI="([^"]+)"/);
  if (match) {
    MONGODB_URI = match[1];
  }
}

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in .env.local');
  process.exit(1);
}

// Re-define schemas to avoid TS import issues
const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  area_zone: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  preferred_budget: { type: Number },
});

const transportModeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  base_fare: { type: Number, required: true },
  cost_per_km: { type: Number, required: true },
  average_speed: { type: Number, required: true },
  time_multiplier: { type: Number, required: true, default: 1.0 },
});

const incidentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  type: { type: String, required: true },
  severity: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  description: { type: String },
  status: { type: String, enum: ['Active', 'Resolved', 'Under Review'], default: 'Active' },
  reported_at: { type: Date, default: Date.now },
});

// CSV line parser that handles quotes
function parseCsvLine(text) {
  const re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\s\S][^'\\]*)*)'|"([^"\\]*(?:\\[\s\S][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
  let a = [];
  text.replace(re_value, function(m0, m1, m2, m3) {
      if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
      else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
      else if (m3 !== undefined) a.push(m3);
      return '';
  });
  if (/,\s*$/.test(text)) a.push('');
  return a;
}

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB Atlas!");

  const Location = mongoose.models.Location || mongoose.model("Location", locationSchema);
  const User = mongoose.models.User || mongoose.model("User", userSchema);
  const TransportMode = mongoose.models.TransportMode || mongoose.model("TransportMode", transportModeSchema);
  const Incident = mongoose.models.Incident || mongoose.model("Incident", incidentSchema);

  // Clear existing data to avoid duplicates from seed
  await Location.deleteMany({});
  await User.deleteMany({});
  await TransportMode.deleteMany({});
  await Incident.deleteMany({});
  console.log("Cleared old data.");

  const csvContent = fs.readFileSync('_SmartNavDATABASE_.csv', 'utf8');
  const lines = csvContent.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  let currentMode = null;
  const idMaps = {
    locations: {},
    users: {},
    transports: {}
  };

  const parsedData = {
    locations: [],
    users: [],
    transports: [],
    incidents: []
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const columns = parseCsvLine(line);

    // Detect header changes
    if (columns[0] === 'location_id' && columns[1] === 'location_name') {
      currentMode = 'locations';
      continue;
    } else if (columns[0] === 'user_id' && columns[1] === 'name') {
      currentMode = 'users';
      continue;
    } else if (columns[0] === 'transport_id' && columns[1] === 'transport_type') {
      currentMode = 'transports';
      continue;
    } else if (columns[0] === 'incident_id' && columns[1] === 'user_id') {
      currentMode = 'incidents';
      continue;
    } else if (['cache_id', 'route_id', 'segment_id', 'traffic_id', 'availability_id', 'fare_id', 'review_id', 'trip_id'].includes(columns[0])) {
      currentMode = 'skip';
      continue;
    }

    if (currentMode === 'skip' || !currentMode) continue;

    if (currentMode === 'locations') {
      const doc = new Location({
        name: columns[1],
        latitude: parseFloat(columns[2]),
        longitude: parseFloat(columns[3]),
        area_zone: columns[4]
      });
      parsedData.locations.push({ id: columns[0], doc });
    } else if (currentMode === 'users') {
      const doc = new User({
        name: columns[1],
        email: columns[2],
        password_hash: columns[3], // Raw from CSV or we can hash it? Let's use as is, maybe bcrypt it
        preferred_budget: parseFloat(columns[4]) || 0,
        role: columns[7] || 'user'
      });
      // Hash password if not already bcrypt hashed
      if (!doc.password_hash.startsWith('$2')) {
        doc.password_hash = bcrypt.hashSync(doc.password_hash, 10);
      }
      parsedData.users.push({ id: columns[0], doc });
    } else if (currentMode === 'transports') {
      const doc = new TransportMode({
        type: columns[1],
        average_speed: parseFloat(columns[2]),
        base_fare: parseFloat(columns[3]),
        cost_per_km: 10, // Not in CSV? Default 10
        time_multiplier: 1.0
      });
      parsedData.transports.push({ id: columns[0], doc });
    } else if (currentMode === 'incidents') {
      parsedData.incidents.push({
        id: columns[0],
        user_id: columns[1],
        location_id: columns[2],
        type: columns[3],
        severity: columns[4],
        timestamp: new Date(columns[5]),
        status: columns[6]
      });
    }
  }

  // Insert Locations
  for (const item of parsedData.locations) {
    const saved = await item.doc.save();
    idMaps.locations[item.id] = saved._id;
  }
  console.log(`Inserted ${parsedData.locations.length} locations.`);

  // Insert Users
  for (const item of parsedData.users) {
    const saved = await item.doc.save();
    idMaps.users[item.id] = saved._id;
  }
  console.log(`Inserted ${parsedData.users.length} users.`);

  // Insert Transports
  for (const item of parsedData.transports) {
    const saved = await item.doc.save();
    idMaps.transports[item.id] = saved._id;
  }
  console.log(`Inserted ${parsedData.transports.length} transports.`);

  // Insert Incidents
  for (const item of parsedData.incidents) {
    const userId = idMaps.users[item.user_id];
    const locId = idMaps.locations[item.location_id];
    if (userId && locId) {
      const doc = new Incident({
        user: userId,
        location: locId,
        type: item.type,
        severity: item.severity,
        reported_at: item.timestamp,
        status: item.status
      });
      await doc.save();
    }
  }
  console.log(`Inserted ${parsedData.incidents.length} incidents.`);

  console.log("Database successfully seeded from CSV!");
  await mongoose.disconnect();
}

seed().catch(console.error);
