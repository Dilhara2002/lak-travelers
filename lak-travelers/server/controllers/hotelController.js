import asyncHandler from 'express-async-handler';
import Hotel from '../models/Hotel.js';

// @desc    Fetch all hotels (with optional search)
// @route   GET /api/hotels?keyword=kandy
// @access  Public
const getHotels = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: 'i' } },
          { location: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  const hotels = await Hotel.find({ ...keyword });
  res.json(hotels);
});

// @desc    Create a hotel
// @route   POST /api/hotels
// @access  Private (Vendor/Admin)
const createHotel = asyncHandler(async (req, res) => {
  const { name, location, description, pricePerNight, image, mapUrl } = req.body;

  if (!name || !location || !description || !pricePerNight || !image || !mapUrl) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  const hotel = new Hotel({
    user: req.user._id,
    name,
    location,
    description,
    pricePerNight,
    image,
    mapUrl,
  });

  const createdHotel = await hotel.save();
  res.status(201).json(createdHotel);
});

// @desc    Get hotel by ID
// @route   GET /api/hotels/:id
// @access  Public
const getHotelById = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (hotel) {
    res.json(hotel);
  } else {
    res.status(404);
    throw new Error('Hotel not found');
  }
});

// @desc    Update a hotel
// @route   PUT /api/hotels/:id
// @access  Private (Vendor/Admin)
const updateHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (hotel) {
    const { name, location, description, pricePerNight, image, mapUrl } = req.body;

    hotel.name = name || hotel.name;
    hotel.location = location || hotel.location;
    hotel.description = description || hotel.description;
    hotel.pricePerNight = pricePerNight || hotel.pricePerNight;
    hotel.image = image || hotel.image;
    hotel.mapUrl = mapUrl || hotel.mapUrl;

    const updatedHotel = await hotel.save();
    res.json(updatedHotel);
  } else {
    res.status(404);
    throw new Error('Hotel not found');
  }
});

// @desc    Delete a hotel
// @route   DELETE /api/hotels/:id
// @access  Private (Vendor/Admin)
const deleteHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (hotel) {
    // Only Admin or Owner can delete
    if (req.user.role === 'admin' || hotel.user.toString() === req.user._id.toString()) {
      await hotel.deleteOne();
      res.json({ message: 'Hotel removed successfully' });
    } else {
      res.status(401);
      throw new Error('Not authorized to delete this hotel');
    }
  } else {
    res.status(404);
    throw new Error('Hotel not found');
  }
});

// @desc    Create new review
// @route   POST /api/hotels/:id/reviews
// @access  Private
const createHotelReview = asyncHandler(async (req, res) => {
  const { rating, comment, image } = req.body;

  const hotel = await Hotel.findById(req.params.id);

  if (hotel) {
    // Check if user already reviewed
    const alreadyReviewed = hotel.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('You have already reviewed this hotel');
    }

    // Create review
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    if (image) {
      review.image = image; // Optional image in review
    }

    hotel.reviews.push(review);

    // Update rating & number of reviews
    hotel.numReviews = hotel.reviews.length;
    hotel.rating =
      hotel.reviews.reduce((acc, item) => item.rating + acc, 0) /
      hotel.reviews.length;

    await hotel.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Hotel not found');
  }
});

export {
  getHotels,
  createHotel,
  getHotelById,
  updateHotel,
  deleteHotel,
  createHotelReview,
};
