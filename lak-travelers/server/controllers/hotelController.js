import asyncHandler from 'express-async-handler';
import Hotel from '../models/Hotel.js';

/**
 * @desc    සියලුම හෝටල් ලබා ගැනීම (සෙවුම් පහසුකම සහිතව)
 * @route   GET /api/hotels
 * @access  Public
 */
const getHotels = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: 'i' } },
          { location: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  const hotels = await Hotel.find({ ...keyword }).sort({ createdAt: -1 });
  res.json(hotels);
});

/**
 * @desc    අලුත් හෝටලයක් ඇතුළත් කිරීම
 * @route   POST /api/hotels
 * @access  Private (Vendor/Admin)
 */
const createHotel = asyncHandler(async (req, res) => {
  const { name, location, description, pricePerNight, image, mapUrl } = req.body;

  if (!name || !location || !description || !pricePerNight || !image || !mapUrl) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  // ✅ FIX: Image එක Object එකක් ලෙස ලැබෙන්නේ නම් එහි URL එක පමණක් ලබා ගැනීම
  const finalImage = typeof image === 'object' ? image.image : image;

  const hotel = new Hotel({
    user: req.user._id,
    name,
    location,
    description,
    pricePerNight,
    image: finalImage, // String URL එක පමණක් Database එකට යයි
    mapUrl,
  });

  const createdHotel = await hotel.save();
  res.status(201).json(createdHotel);
});

/**
 * @desc    ID එක අනුව හෝටලයක් ලබා ගැනීම
 * @route   GET /api/hotels/:id
 * @access  Public
 */
const getHotelById = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id).populate('user', 'name email');
  
  if (hotel) {
    res.json(hotel);
  } else {
    res.status(404);
    throw new Error('Hotel not found');
  }
});

/**
 * @desc    හෝටල් දත්ත යාවත්කාලීන කිරීම
 * @route   PUT /api/hotels/:id
 * @access  Private (Vendor/Admin)
 */
const updateHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (hotel) {
    if (hotel.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to update this hotel');
    }

    hotel.name = req.body.name || hotel.name;
    hotel.location = req.body.location || hotel.location;
    hotel.description = req.body.description || hotel.description;
    hotel.pricePerNight = req.body.pricePerNight || hotel.pricePerNight;
    
    // ✅ FIX: මෙහිදීද Image එක String එකක් බව තහවුරු කරයි
    if (req.body.image) {
      hotel.image = typeof req.body.image === 'object' ? req.body.image.image : req.body.image;
    }
    
    hotel.mapUrl = req.body.mapUrl || hotel.mapUrl;

    const updatedHotel = await hotel.save();
    res.json(updatedHotel);
  } else {
    res.status(404);
    throw new Error('Hotel not found');
  }
});

/**
 * @desc    හෝටලයක් මකා දැමීම
 */
const deleteHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (hotel) {
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

/**
 * @desc    නව සමාලෝචනයක් (Review) එක් කිරීම
 * @route   POST /api/hotels/:id/reviews
 * @access  Private
 */
const createHotelReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const hotel = await Hotel.findById(req.params.id);

  if (hotel) {
    const alreadyReviewed = hotel.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('You have already reviewed this hotel');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    hotel.reviews.push(review);
    hotel.numReviews = hotel.reviews.length;

    // සාමාන්‍ය රේටින්ග් එක ගණනය කිරීම
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