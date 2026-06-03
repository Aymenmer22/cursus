import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Module name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Module code is required'],
    trim: true,
    uppercase: true
  },
  coefficient: {
    type: Number,
    required: [true, 'Coefficient is required'],
    min: [0.5, 'Coefficient must be at least 0.5'],
    max: [5, 'Coefficient cannot exceed 5']
  },
  evaluationType: {
    type: String,
    enum: ['exam', 'td', 'tp', 'td+exam', 'tp+exam', 'td+tp+exam', 'tp-only'],
    required: [true, 'Evaluation type is required']
  },
  credits: {
    type: Number,
    default: 0,
    min: [0, 'Credits cannot be negative']
  }
}, { _id: false });

const semesterSchema = new mongoose.Schema({
  semesterNumber: {
    type: Number,
    required: [true, 'Semester number is required'],
    min: [1, 'Semester number must be at least 1'],
    max: [10, 'Semester number cannot exceed 10']
  },
  modules: {
    type: [moduleSchema],
    required: [true, 'Modules are required'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one module is required per semester'
    }
  }
}, { _id: false });

const programSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ['L1', 'L2', 'L3-ISIL', 'L3-SI', 'M1', 'M2-ISI', 'M2-RSSI'],
    required: [true, 'Level is required'],
    index: true
  },
  speciality: {
    type: String,
    required: [true, 'Speciality is required'],
    trim: true,
    index: true
  },
  semesters: {
    type: [semesterSchema],
    required: [true, 'Semesters are required'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one semester is required'
    }
  },
  totalCredits: {
    type: Number,
    default: 0,
    min: [0, 'Total credits cannot be negative']
  },
  description: {
    type: String,
    default: null,
    trim: true
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

// Index composé pour recherches fréquentes
programSchema.index({ level: 1, speciality: 1 }, { unique: true });
programSchema.index({ 'semesters.semesterNumber': 1 });

// Middleware pour calculer le total des crédits
programSchema.pre('save', function(next) {
  if (this.semesters && this.semesters.length > 0) {
    this.totalCredits = this.semesters.reduce((total, semester) => {
      return total + semester.modules.reduce((semTotal, module) => {
        return semTotal + (module.credits || 0);
      }, 0);
    }, 0);
  }
  next();
});

// Méthode pour obtenir les modules d'un semestre
programSchema.methods.getModulesBySemester = function(semesterNumber) {
  const semester = this.semesters.find(s => s.semesterNumber === semesterNumber);
  return semester ? semester.modules : [];
};

// Méthode statique pour obtenir tous les niveaux disponibles
programSchema.statics.getLevels = async function() {
  const programs = await this.distinct('level');
  return programs.sort();
};

// Méthode statique pour obtenir les spécialités d'un niveau
programSchema.statics.getSpecialities = async function(level) {
  const programs = await this.find({ level }).select('speciality');
  return programs.map(p => p.speciality).sort();
};

export default mongoose.model('Program', programSchema);
