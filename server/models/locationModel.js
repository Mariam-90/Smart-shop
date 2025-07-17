const mongoose = require('mongoose');
const { Schema } = mongoose;

const locationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' }, // מקושר למודל המשתמש
  latitude: Number,
  longitude: Number
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
