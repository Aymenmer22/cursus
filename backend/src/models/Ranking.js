import mongoose from 'mongoose';

const rankingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
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
  averageGrade: {
    type: Number,
    required: [true, 'Average grade is required'],
    min: [0, 'Average grade cannot be negative'],
    max: [20, 'Average grade cannot exceed 20'],
    index: true
  },
  rank: {
    type: Number,
    default: 0,
    min: [0, 'Rank cannot be negative']
  },
  totalStudents: {
    type: Number,
    default: 0,
    min: [0, 'Total students cannot be negative']
  },
  percentile: {
    type: Number,
    default: 0,
    min: [0, 'Percentile cannot be less than 0'],
    max: [100, 'Percentile cannot exceed 100']
  },
  semesters: [{
    semesterNumber: Number,
    grade: Number,
    validated: Number,
    failed: Number
  }],
  lastUpdated: {
    type: Date,
    default: Date.now,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index composé pour recherches fréquentes
rankingSchema.index({ level: 1, speciality: 1, averageGrade: -1 });
rankingSchema.index({ userId: 1, level: 1, speciality: 1 }, { unique: true });
rankingSchema.index({ rank: 1, level: 1, speciality: 1 });

// Méthode statique pour calculer les percentiles
rankingSchema.statics.calculatePercentiles = async function(level, speciality) {
  const rankings = await this.find({ level, speciality })
    .sort({ averageGrade: -1 })
    .exec();

  if (rankings.length === 0) return {};

  return {
    total: rankings.length,
    top10: rankings[0]?.averageGrade || 0,
    top25: rankings[Math.floor(rankings.length * 0.25) - 1]?.averageGrade || 0,
    top50: rankings[Math.floor(rankings.length * 0.50) - 1]?.averageGrade || 0,
    average: (rankings.reduce((sum, r) => sum + r.averageGrade, 0) / rankings.length).toFixed(2),
    minimum: rankings[rankings.length - 1]?.averageGrade || 0
  };
};

// Méthode statique pour mettre à jour les classements
rankingSchema.statics.updateRankings = async function(level, speciality) {
  const rankings = await this.find({ level, speciality })
    .sort({ averageGrade: -1 })
    .exec();

  const totalStudents = rankings.length;

  rankings.forEach((ranking, index) => {
    ranking.rank = index + 1;
    ranking.totalStudents = totalStudents;
    ranking.percentile = Math.round(((totalStudents - index) / totalStudents) * 100);
    ranking.lastUpdated = new Date();
  });

  // Sauvegarder tous les classements mises à jour
  await Promise.all(rankings.map(r => r.save()));
  return rankings;
};

// Méthode pour obtenir le statut de l'étudiant
rankingSchema.methods.getStatus = function() {
  if (this.rank <= this.totalStudents * 0.1) return 'top-10%';
  if (this.rank <= this.totalStudents * 0.25) return 'top-25%';
  if (this.rank <= this.totalStudents * 0.5) return 'top-50%';
  return 'average';
};

// Middleware pour formater les données
rankingSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.status = this.getStatus();
  return obj;
};

export default mongoose.model('Ranking', rankingSchema);
