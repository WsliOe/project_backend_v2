const express = require('express');
const hoursController = require('./../controllers/hoursController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(authController.restrictTo('admin'), hoursController.getAllHours)
  .post(
    authController.restrictTo('admin', 'member'),
    hoursController.sendHours,
  );

router
  .route('/:id')
  .get(authController.restrictTo('admin', 'member'), hoursController.getHours)
  .patch(
    authController.restrictTo('admin', 'member'),
    hoursController.updateHours,
  )
  .delete(
    authController.restrictTo('admin', 'member'),
    hoursController.deleteHours,
  );

module.exports = router;
