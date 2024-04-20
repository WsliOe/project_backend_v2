const Hours = require('./../models/hoursModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllHours = factory.getAll(Hours);
exports.getHours = factory.getOne(Hours);
exports.updateHours = factory.updateOne(Hours);
exports.deleteHours = factory.deleteOne(Hours);

exports.sendHours = catchAsync(async (req, res, next) => {
  req.body.user = req.user._id;
  const newHours = await Hours.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      hours: newHours,
    },
  });
});
