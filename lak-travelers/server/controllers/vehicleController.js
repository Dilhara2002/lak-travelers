import asyncHandler from 'express-async-handler';
import Vehicle from '../models/Vehicle.js';

/**
 * @desc    සියලුම වාහන ලබා ගැනීම
 * @route   GET /api/vehicles
 * @access  Public
 */
const getVehicles = asyncHandler(async (req, res) => {
  // සෙවුම් පහසුකම් සඳහා keyword එකක් තිබේදැයි බලයි
  const keyword = req.query.keyword
    ? {
        vehicleModel: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const vehicles = await Vehicle.find({ ...keyword }).populate('user', 'name email');
  res.json(vehicles);
});

/**
 * @desc    ID එක අනුව වාහනයක විස්තර ලබා ගැනීම
 * @route   GET /api/vehicles/:id
 * @access  Public
 */
const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id).populate('user', 'name email');

  if (vehicle) {
    res.json(vehicle);
  } else {
    res.status(404);
    throw new Error('Vehicle not found');
  }
});

/**
 * @desc    අලුත් වාහනයක් ඇතුළත් කිරීම
 * @route   POST /api/vehicles
 * @access  Private (Vendor / Admin)
 */
const createVehicle = asyncHandler(async (req, res) => {
  // 🔐 ආරක්ෂක පියවර: අනුමත වූ Vendor කෙනෙක් දැයි බැලීම
  if (req.user.role === 'vendor' && !req.user.isApproved) {
    res.status(403);
    throw new Error('Your vendor account is not approved yet by admin');
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

  // 🛑 අත්‍යවශ්‍ය දත්ත Validation
  if (!driverName || !vehicleModel || !type || !licensePlate || !capacity || !pricePerDay || !contactNumber || !images || images.length === 0) {
    res.status(400);
    throw new Error('Please fill all required fields and upload at least one image');
  }

  const vehicle = new Vehicle({
    user: req.user._id, // Auth middleware එකෙන් ලැබෙන ID එක
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
 * @desc    වාහනයක විස්තර යාවත්කාලීන කිරීම
 * @route   PUT /api/vehicles/:id
 * @access  Private (Vendor/Admin)
 */
const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (vehicle) {
    // 🔐 ආරක්ෂක පියවර: අයිතිකරුට හෝ ඇඩ්මින්ට පමණක් අවසරය
    if (vehicle.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to update this vehicle listing');
    }

    vehicle.driverName = req.body.driverName || vehicle.driverName;
    vehicle.vehicleModel = req.body.vehicleModel || vehicle.vehicleModel;
    vehicle.type = req.body.type || vehicle.type;
    vehicle.licensePlate = req.body.licensePlate || vehicle.licensePlate;
    vehicle.capacity = req.body.capacity || vehicle.capacity;
    vehicle.pricePerDay = req.body.pricePerDay || vehicle.pricePerDay;
    vehicle.description = req.body.description || vehicle.description;
    vehicle.contactNumber = req.body.contactNumber || vehicle.contactNumber;
    vehicle.images = req.body.images || vehicle.images;

    const updatedVehicle = await vehicle.save();
    res.json(updatedVehicle);
  } else {
    res.status(404);
    throw new Error('Vehicle not found');
  }
});

/**
 * @desc    වාහනයක් මකා දැමීම
 * @route   DELETE /api/vehicles/:id
 * @access  Private (Admin or Owner)
 */
const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (vehicle) {
    // 🔐 Admin හෝ අයිතිකරුට පමණක් අවසරය
    if (req.user.role === 'admin' || vehicle.user.toString() === req.user._id.toString()) {
      await vehicle.deleteOne();
      res.json({ message: 'Vehicle removed successfully' });
    } else {
      res.status(401);
      throw new Error('Not authorized to delete this vehicle');
    }
  } else {
    res.status(404);
    throw new Error('Vehicle not found');
  }
});

/**
 * @desc    නව සමාලෝචනයක් (Review) එක් කිරීම
 * @route   POST /api/vehicles/:id/reviews
 * @access  Private
 */
const createVehicleReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
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
      user: req.user._id,
    };

    vehicle.reviews.push(review);
    vehicle.numReviews = vehicle.reviews.length;
    
    // සාමාන්‍ය රේටින්ග් එක ගණනය කිරීම
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
  updateVehicle,
  deleteVehicle,
  createVehicleReview,
};