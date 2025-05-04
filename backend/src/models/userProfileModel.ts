import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  introduction: {
    type: String,
    default: ''
  },
  education: [{
    school: {
      type: String,
      required: true
    },
    degree: {
      type: String,
      required: true
    },
    major: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    description: {
      type: String,
      default: ''
    }
  }],
  workExperience: [{
    company: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    achievements: [{
      type: String
    }]
  }],
  skills: [{
    name: {
      type: String,
      required: true
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      required: true
    },
    yearsOfExperience: {
      type: Number,
      required: true
    }
  }],
  projects: [{
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    technologies: [{
      type: String
    }]
  }],
  languages: [{
    name: {
      type: String,
      required: true
    },
    level: {
      type: String,
      enum: ['basic', 'intermediate', 'advanced', 'native'],
      required: true
    }
  }],
  certifications: [{
    name: {
      type: String,
      required: true
    },
    issuer: {
      type: String,
      required: true
    },
    issueDate: {
      type: Date,
      required: true
    },
    expiryDate: {
      type: Date
    },
    credentialId: {
      type: String
    }
  }]
}, {
  timestamps: true
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

export default UserProfile; 