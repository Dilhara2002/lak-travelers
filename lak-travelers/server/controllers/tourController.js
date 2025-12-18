import asyncHandler from 'express-async-handler';
import Tour from '../models/Tour.js';

/**
 * @desc    Fetch all tours
 * @route   GET /api/tours
 * @access  Public
 */
const getTours = asyncHandler(async (req, res) => {
  // සෙවුම් පහසුකම් සඳහා keyword එකක් තිබේදැයි බලයි
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const tours = await Tour.find({ ...keyword }).populate('user', 'name email');
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
  // 🔐 අනුමත වූ (Approved) Vendor කෙනෙක් දැයි පරීක්ෂා කිරීම
  if (req.user.role === 'vendor' && !req.user.isApproved) {
    res.status(403);
    throw new Error('Your vendor account is not approved yet');
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

  // 🛑 අත්‍යවශ්‍ය දත්ත තිබේදැයි පරීක්ෂා කිරීම
  if (!name || !description || !price || !duration || !destinations || !groupSize || !image) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  const tour = new Tour({
    user: req.user._id, // Auth middleware එකෙන් ලැබෙන ID එක
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
 * @desc    Update a tour
 * @route   PUT /api/tours/:id
 * @access  Private (Vendor/Admin)
 */
const updateTour = asyncHandler(async (req, res) => {
  const { name, description, destinations, duration, price, groupSize, image } = req.body;
  const tour = await Tour.findById(req.params.id);

  if (tour) {
    // 🔐 ආරක්ෂක පියවර: අයිතිකරුට හෝ ඇඩ්මින්ට පමණක් අවසරය
    if (req.user.role !== 'admin' && tour.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this tour');
    }

    tour.name = name || tour.name;
    tour.description = description || tour.description;
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

/**
 * @desc    Delete a tour
 * @route   DELETE /api/tours/:id
 * @access  Private (Admin or Owner)
 */
const deleteTour = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id);

  if (tour) {
    // 🔐 Admin OR Owner can delete
    if (req.user.role === 'admin' || tour.user.toString() === req.user._id.toString()) {
      await tour.deleteOne();
      res.json({ message: 'Tour removed successfully' });
    } else {
      res.status(401);
      throw new Error('Not authorized to delete this tour');
    }
  } else {
    res.status(404);
    throw new Error('Tour not found');
  }
});

/**
 * @desc    Create new review
 * @route   POST /api/tours/:id/reviews
 * @access  Private
 */
const createTourReview = asyncHandler(async (req, res) => {
  const { rating, comment, image } = req.body;
  const tour = await Tour.findById(req.params.id);

  if (tour) {
    const alreadyReviewed = tour.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('You have already reviewed this tour');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      image,
      user: req.user._id,
    };

    tour.reviews.push(review);
    tour.numReviews = tour.reviews.length;
    
    // සාමාන්‍ය රේටින්ග් එක ගණනය කිරීම
    tour.rating =
      tour.reviews.reduce((acc, item) => item.rating + acc, 0) /
      tour.reviews.length;

    await tour.save();
    res.status(201).json({ message: 'Review added' });
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
  createTourReview,
};