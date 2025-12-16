import asyncHandler from 'express-async-handler';
import Tour from '../models/Tour.js';

/**
 * @desc    Fetch all tours
 * @route   GET /api/tours
 * @access  Public
 */
const getTours = asyncHandler(async (req, res) => {
  const tours = await Tour.find({}).populate('user', 'name email');
  res.json(tours);
});

/**
 * @desc    Get single tour by ID
 * @route   GET /api/tours/:id
 * @access  Public
 */
const getTourById = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id).populate('user', 'name email');

  if (!tour) {
    res.status(404);
    throw new Error('Tour not found');
  }

  res.json(tour);
});

/**
 * @desc    Create a new tour
 * @route   POST /api/tours
 * @access  Private (Vendor / Admin)
 */
const createTour = asyncHandler(async (req, res) => {
  // 🔐 Role-based authorization
  if (req.user.role !== 'vendor' && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to create tours');
  }

  const {
    name,
    description,
    price,
    duration,
    destinations,
    groupSize,
    image,
  } = req.body;

  // 🛑 Validation
  if (!name || !description || !price || !duration || !destinations || !groupSize || !image) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  const tour = new Tour({
    user: req.user._id,
    name,
    description,
    price,
    duration,
    destinations,
    groupSize,
    image,
  });

  const createdTour = await tour.save();
  res.status(201).json(createdTour);
});

/**
 * @desc    Delete a tour
 * @route   DELETE /api/tours/:id
 * @access  Private (Admin or Owner)
 */
const deleteTour = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    res.status(404);
    throw new Error('Tour not found');
  }

  // 🔐 Admin OR Owner can delete
  if (
    req.user.role === 'admin' ||
    tour.user.toString() === req.user._id.toString()
  ) {
    await tour.deleteOne();
    res.json({ message: 'Tour removed successfully' });
  } else {
    res.status(401);
    throw new Error('Not authorized to delete this tour');
  }
});

// @desc    Update a tour
// @route   PUT /api/tours/:id
// @access  Private (Vendor/Admin)
const updateTour = asyncHandler(async (req, res) => {
  const { name, destinations, duration, price, groupSize, image } = req.body;
  const tour = await Tour.findById(req.params.id);

  if (tour) {
    // Security Check: අයිතිකාරයාද හෝ Admin ද කියලා බලනවා
    if (req.user.role !== 'admin' && tour.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this tour');
    }

    tour.name = name || tour.name;
    tour.destinations = destinations || tour.destinations;
    tour.duration = duration || tour.duration;
    tour.price = price || tour.price;
    tour.groupSize = groupSize || tour.groupSize;
    tour.image = image || tour.image;

    const updatedTour = await tour.save();
    res.json(updatedTour);
  } else {
    res.status(404);
    throw new Error('Tour not found');
  }
});

export {
  getTours,
  getTourById,
  createTour,
  deleteTour,
  updateTour,
};
