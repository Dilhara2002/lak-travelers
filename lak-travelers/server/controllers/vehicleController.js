import asyncHandler from 'express-async-handler';
import Vehicle from '../models/Vehicle.js';

/**
 * @desc    Fetch all vehicles
 * @route   GET /api/vehicles
 * @access  Public
 */
const getVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({}).populate('user', 'name email');
  res.json(vehicles);
});

/**
 * @desc    Get single vehicle by ID
 * @route   GET /api/vehicles/:id
 * @access  Public
 */
const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found');
  }

  res.json(vehicle);
});

/**
 * @desc    Create a vehicle listing
 * @route   POST /api/vehicles
 * @access  Private (Vendor / Admin)
 */
const createVehicle = asyncHandler(async (req, res) => {
  // 🔐 Role-based authorization
  if (req.user.role !== 'vendor' && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to create vehicle listings');
  }

  const {
    driverName,
    vehicleModel,
    type,
    licensePlate,
    capacity,
    pricePerDay,
    description,
    contactNumber,
    images,
  } = req.body;

  // 🛑 Validation
  if (
    !driverName ||
    !vehicleModel ||
    !type ||
    !licensePlate ||
    !capacity ||
    !pricePerDay ||
    !contactNumber ||
    !images ||
    images.length === 0
  ) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  const vehicle = new Vehicle({
    user: req.user._id,
    driverName,
    vehicleModel,
    type,
    licensePlate,
    capacity,
    pricePerDay,
    description,
    contactNumber,
    images,
  });

  const createdVehicle = await vehicle.save();
  res.status(201).json(createdVehicle);
});

/**
 * @desc    Delete a vehicle
 * @route   DELETE /api/vehicles/:id
 * @access  Private (Admin or Owner)
 */
const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found');
  }

  // 🔐 Admin OR Owner
  if (
    req.user.role === 'admin' ||
    vehicle.user.toString() === req.user._id.toString()
  ) {
    await vehicle.deleteOne();
    res.json({ message: 'Vehicle removed successfully' });
  } else {
    res.status(401);
    throw new Error('Not authorized to delete this vehicle');
  }
});

// @desc    Create new review
// @route   POST /api/vehicles/:id/reviews
// @access  Private
const createVehicleReview = asyncHandler(async (req, res) => {
  const { rating, comment, image } = req.body;
  const vehicle = await Vehicle.findById(req.params.id);

  if (vehicle) {
    const alreadyReviewed = vehicle.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('You have already reviewed this vehicle');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      image,
      user: req.user._id,
    };

    vehicle.reviews.push(review);
    vehicle.numReviews = vehicle.reviews.length;
    vehicle.rating =
      vehicle.reviews.reduce((acc, item) => item.rating + acc, 0) /
      vehicle.reviews.length;

    await vehicle.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Vehicle not found');
  }
});

export {
  getVehicles,
  getVehicleById,
  createVehicle,
  deleteVehicle,
  createVehicleReview,
};
