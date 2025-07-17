const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  files: [String],
  date: {
    type: Date,
    default: Date.now
  },
  treated: {
    type: Boolean,
    default: false
  }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = { Message };
