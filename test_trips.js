const mongoose = require('mongoose');
require('dotenv').config({path: '.env.local'});

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Define Schemas manually to avoid TS module issues in raw node
  const LocationSchema = new mongoose.Schema({ name: String });
  const Location = mongoose.models.Location || mongoose.model('Location', LocationSchema);
  
  const RouteSchema = new mongoose.Schema({ 
    source_location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    destination_location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' }
  });
  const Route = mongoose.models.Route || mongoose.model('Route', RouteSchema);
  
  const TripSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId },
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
    travel_time: Number,
    travel_cost: Number,
    trip_date: Date
  });
  const Trip = mongoose.models.Trip || mongoose.model('Trip', TripSchema);

  try {
    const trips = await Trip.find()
      .populate({
        path: "route",
        populate: [
          { path: "source_location", model: Location },
          { path: "destination_location", model: Location }
        ]
      })
      .lean();
      
    console.log("Populated trips count:", trips.length);
    if (trips.length > 0) {
      console.log("First trip route:", trips[0].route);
    }
  } catch (err) {
    console.error("Error populating:", err);
  }
  
  process.exit(0);
}

test();
