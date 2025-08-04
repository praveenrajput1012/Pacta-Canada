const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true },
  description: { type: String, required: true },
  links:       [{ type: String }],
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);