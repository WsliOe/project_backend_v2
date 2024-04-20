const mongoose = require('mongoose');

const hoursSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  year: { type: Number, required: true },

  quarter: { type: Number, required: true, min: 1, max: 4 },

  hours: {
    type: Number,
    required: true,
    min: 0,
  },

  totalHoursYear: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now(), select: false },
});

// Calculation total hours per user and year
hoursSchema.post(
  ['save', 'findOneAndUpdate', 'findOneAndDelete'],
  async function (doc, next) {
    try {
      await Hours.calculateAndUpdateTotalHoursYear(doc.user, doc.year);
      next();
    } catch (error) {
      console.error('Error calculating and updating total hours:', error);
      next(error);
    }
  },
);

hoursSchema.statics.calculateAndUpdateTotalHoursYear = async function (
  userId,
  year,
) {
  try {
    const stats = await this.aggregate([
      { $match: { user: userId, year: year } },
      { $group: { _id: null, totalHoursYear: { $sum: '$hours' } } },
    ]);

    const totalHoursYear = stats.length > 0 ? stats[0].totalHoursYear : 0;

    await this.updateMany(
      { user: userId, year: year },
      { totalHoursYear: totalHoursYear },
    );
  } catch (error) {
    throw new Error('Error calculating and updating total hours:', error);
  }
};

const Hours = mongoose.model('Hours', hoursSchema);

module.exports = Hours;
