const express = require("express");
const router = express.Router();
const axios = require("axios");
const { User } = require("../models/user");
const authenticateToken = require('../models/authenticateToken');
const Location = require('../models/locationModel');




// מפתח של Google Maps API
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

// Update location
router.post("/location", async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    user.location = { latitude, longitude };
    await user.save();
    res.status(200).send({ message: "Location updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Fetch location by address
router.get('/location', async (req, res) => {
  try {
      const address = req.query.address;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleMapsApiKey}`;
      const response = await axios.get(url);
      const location = response.data.results[0].geometry.location;
      res.json({ location });
  } catch (error) {
      console.error('Error fetching location:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Save user location
router.post('/api/user/location', authenticateToken, async (req, res) => {
  console.log('Received location request:', req.body);

  // כאן אנו מצפים לקבל את הנתונים ישירות מהגוף בקשה, לא מתוך אובייקט משני
  const { latitude, longitude, email } = req.body;

  try {
    const newLocation = new Location({
      user: req.user.id, // זיהוי המשתמש, אני מניח שכבר יש לך מנגנון לזיהוי מה-token
      latitude: latitude,
      longitude: longitude,
      email: email // אם אתה רוצה לשמור גם את האימייל
    });

    await newLocation.save();
    console.log('Location saved successfully.');
    res.json({ message: 'Location received and saved successfully.' });
  } catch (error) {
    console.error('Error saving location:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
