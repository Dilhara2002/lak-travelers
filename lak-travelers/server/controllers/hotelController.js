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

// @desc    Delete a hotel
// @route   DELETE /api/hotels/:id
// @access  Private
// ... imports ...

// @desc    Delete a hotel
// @route   DELETE /api/hotels/:id
// @access  Private (Vendor/Admin)
const deleteHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (hotel) {
    // 👇 Security Check: 
    // මකන කෙනා Admin ද? OR මකන කෙනා මේ හෝටලය දාපු කෙනා (Owner) ද?
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
// @access  Private
const updateHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (hotel) {
    // අලුත් විස්තර තිබේ නම් ඒවා දාන්න, නැත්නම් පරණ ඒවාම තියන්න
    hotel.name = req.body.name || hotel.name;
    hotel.location = req.body.location || hotel.location;
    hotel.description = req.body.description || hotel.description;
    hotel.pricePerNight = req.body.pricePerNight || hotel.pricePerNight;
    hotel.image = req.body.image || hotel.image;

    const updatedHotel = await hotel.save(); // Save කරනවා
    res.json(updatedHotel);
  } else {
    res.status(404);
    throw new Error('Hotel not found');
  }
});


// @desc    Create new review
// @route   POST /api/hotels/:id/reviews
// @access  Private
const createHotelReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const hotel = await Hotel.findById(req.params.id);

  if (hotel) {
    // 1. මේ User කලින් Review කරලද බලනවා (එක පාරයි පුළුවන්)
    const alreadyReviewed = hotel.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('You have already reviewed this hotel');
    }

    // 2. Review එක හදනවා
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    // 3. Hotel එකට Review එක දානවා
    hotel.reviews.push(review);

    // 4. අලුත් ගණන් බැලීම් (Calculations)
    hotel.numReviews = hotel.reviews.length;

    // Average Rating = (මුළු එකතුව) / (Reviews ගණන)
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


export { getHotels, createHotel, getHotelById, deleteHotel, updateHotel, createHotelReview };