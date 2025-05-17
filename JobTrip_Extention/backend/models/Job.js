const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  id: {
    type: String,
    default: ''
  },
  platform: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  salary: {
    type: String,
    default: ''
  },
  jobType: {
    type: String,
    default: ''
  },
  requirements: {
    type: [String],
    default: []
  },
  source: {
    type: String,
    default: ''
  },
  sourceId: {
    type: String,
    default: ''
  },
  sourceUrl: {
    type: String,
    default: ''
  },
  deadline: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', jobSchema); 