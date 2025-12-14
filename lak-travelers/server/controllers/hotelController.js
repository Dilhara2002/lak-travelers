import asyncHandler from 'express-async-handler';
import Hotel from '../models/Hotel.js';

// @desc    Fetch all hotels
// @route   GET /api/hotels
// @access  Public
// @desc    Fetch all hotels (with Search)
// @route   GET /api/hotels?keyword=kandy
// @access  Public
const getHotels = asyncHandler(async (req, res) => {
  // 1. URL එකේ 'keyword' කියලා වචනයක් තියෙනවද බලනවා
  const keyword = req.query.keyword
    ? {
        // නම (name) හෝ නගරය (location) ඇතුලේ ඒ වචනය තියෙනවද බලනවා (regex)
        $or: [
          { name: { $regex: req.query.keyword, $options: 'i' } }, // 'i' කියන්නේ Capital/Simple අදාළ නෑ
          { location: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  // 2. ඒ වචනයට ගැළපෙන හෝටල් ටික හොයනවා
  const hotels = await Hotel.find({ ...keyword });
  
  res.json(hotels);
});

// @desc    Create a hotel
// @route   POST /api/hotels
// @access  Private (Login වෙලා ඉන්න අයට විතරයි)
const createHotel = asyncHandler(async (req, res) => {
  const { name, location, description, pricePerNight, image } = req.body;

  const hotel = new Hotel({
    user: req.user._id, // Login වී සිටින user ගේ ID එක
    name,
    location,
    description,
    pricePerNight,
    image,
  });

  const createdHotel = await hotel.save();
  res.status(201).json(createdHotel);
});

export { getHotels, createHotel };