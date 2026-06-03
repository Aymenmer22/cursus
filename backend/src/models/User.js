import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  avatar: {
    type: String,
    default: null,
    trim: true
  },
  level: {
    type: String,
    enum: ['L1', 'L2', 'L3-ISIL', 'L3-SI', 'M1', 'M2-ISI', 'M2-RSSI'],
    required: [true, 'Level is required']
  },
  speciality: {
    type: String,
    required: [true, 'Speciality is required'],
    trim: true
  },
  group: {
    type: String,
    default: null,
    trim: true
  },
  googleId: {
    type: String,
    default: null,
    unique: true,
    sparse: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  sessionId: {
    type: String,
    default: null,
    unique: true,
    sparse: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Indexes pour les requêtes fréquentes
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 }, { sparse: true });
userSchema.index({ level: 1, speciality: 1 });
userSchema.index({ sessionId: 1 }, { sparse: true });

// Virtuel pour nom complet
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Middleware pour exclure les champs sensibles
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.googleId;
  delete obj.sessionId;
  return obj;
};

export default mongoose.model('User', userSchema);
