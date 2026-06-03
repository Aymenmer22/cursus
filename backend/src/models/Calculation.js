import mongoose from 'mongoose';

// Schema pour les notes d'un module
const gradeSchema = new mongoose.Schema({
  moduleName: {
    type: String,
    required: true,
    trim: true
  },
  moduleCode: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  evaluationType: {
    type: String,
    enum: ['exam', 'td', 'tp', 'td+exam', 'tp+exam', 'td+tp+exam', 'tp-only'],
    required: true
  },
  td: {
    type: Number,
    default: null,
    min: [0, 'TD grade cannot be negative'],
    max: [20, 'TD grade cannot exceed 20']
  },
  tp: {
    type: Number,
    default: null,
    min: [0, 'TP grade cannot be negative'],
    max: [20, 'TP grade cannot exceed 20']
  },
  exam: {
    type: Number,
    default: null,
    min: [0, 'Exam grade cannot be negative'],
    max: [20, 'Exam grade cannot exceed 20']
  },
  moduleGrade: {
    type: Number,
    default: null,
    min: [0, 'Module grade cannot be negative'],
    max: [20, 'Module grade cannot exceed 20']
  },
  coefficient: {
    type: Number,
    required: true,
    min: [0.5, 'Coefficient must be at least 0.5']
  },
  status: {
    type: String,
    enum: ['validated', 'failed', 'pending'],
    default: 'pending'
  }
}, { _id: false });

const calculationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  sessionId: {
    type: String,
    default: null,
    index: true
  },
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
  semesterNumber: {
    type: Number,
    required: [true, 'Semester number is required'],
    min: [1, 'Semester number must be at least 1'],
    max: [10, 'Semester number cannot exceed 10']
  },
  grades: {
    type: [gradeSchema],
    required: [true, 'Grades are required'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one grade is required'
    }
  },
  semesterGrade: {
    type: Number,
    default: 0,
    min: [0, 'Semester grade cannot be negative'],
    max: [20, 'Semester grade cannot exceed 20']
  },
  yearGrade: {
    type: Number,
    default: null,
    min: [0, 'Year grade cannot be negative'],
    max: [20, 'Year grade cannot exceed 20']
  },
  validatedModules: {
    type: Number,
    default: 0,
    min: [0, 'Validated modules cannot be negative']
  },
  failedModules: {
    type: Number,
    default: 0,
    min: [0, 'Failed modules cannot be negative']
  },
  totalModules: {
    type: Number,
    default: 0
  },
  isSaved: {
    type: Boolean,
    default: false,
    index: true
  },
  savedName: {
    type: String,
    default: null,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: null,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Indexes pour les requêtes fréquentes
calculationSchema.index({ userId: 1, createdAt: -1 });
calculationSchema.index({ sessionId: 1, createdAt: -1 });
calculationSchema.index({ level: 1, speciality: 1 });
calculationSchema.index({ isSaved: 1 });

// Méthode pour calculer la moyenne semestrielle
calculationSchema.methods.calculateSemesterGrade = function() {
  if (this.grades.length === 0) return 0;

  let totalPoints = 0;
  let totalCoefficients = 0;

  this.grades.forEach(grade => {
    if (grade.moduleGrade !== null && grade.moduleGrade !== undefined) {
      totalPoints += grade.moduleGrade * grade.coefficient;
      totalCoefficients += grade.coefficient;
    }
  });

  return totalCoefficients > 0 ? (totalPoints / totalCoefficients).toFixed(2) : 0;
};

// Méthode pour calculer les modules validés/échoués
calculationSchema.methods.calculateModuleStatus = function() {
  let validated = 0;
  let failed = 0;

  this.grades.forEach(grade => {
    if (grade.moduleGrade !== null && grade.moduleGrade !== undefined) {
      if (grade.moduleGrade >= 10) {
        grade.status = 'validated';
        validated++;
      } else {
        grade.status = 'failed';
        failed++;
      }
    }
  });

  this.validatedModules = validated;
  this.failedModules = failed;
  this.totalModules = validated + failed;
};

// Middleware pour recalculer avant de sauvegarder
calculationSchema.pre('save', function(next) {
  this.calculateModuleStatus();
  this.semesterGrade = this.calculateSemesterGrade();
  next();
});

// Méthode virtuelle pour obtenir le statut global
calculationSchema.virtual('status').get(function() {
  if (this.failedModules > 0) return 'failed';
  if (this.validatedModules === this.totalModules) return 'passed';
  return 'pending';
});

// Méthode pour formater la sortie JSON
calculationSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.status = this.status;
  return obj;
};

export default mongoose.model('Calculation', calculationSchema);
