import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import asyncHandler from "express-async-handler";

// Function to check for duplicate hotel names
async function isHotelNameUnique(name) {
  const existingHotel = await Hotel.findOne({ name });
  return !existingHotel; // Returns true if name is unique (no duplicate)
}

export const createHotel = asyncHandler(async (req, res, next) => {
  const newHotel = new Hotel(req.body);

  const isNameUnique = await isHotelNameUnique(req.body.name);
  if (!isNameUnique) {
    return res.status(400).json({ message: "Hotel name already exists." });
  }

  const savedHotel = await newHotel.save();
  res.status(200).json({ message: "New Hotel Created succesfully" });
});

export const updateHotel = asyncHandler(async (req, res, next) => {
  const isNameUnique = await isHotelNameUnique(req.body.name);
  if (!isNameUnique) {
    return res.status(400).json({ message: "Hotel name already exists." });
  }

  const updatedHotel = await Hotel.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  res.status(200).json({ message: "Hotel updated successfully" });
});

export const deleteHotel = asyncHandler(async (req, res, next) => {
  const hotelId = req.params.id;

  // Check if the hotel with the given ID exists
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    return res.status(404).json({ message: "Hotel not found." });
  }

  // Hotel exists, proceed with deletion
  await Hotel.findByIdAndDelete(hotelId);
  res.status(200).json("Hotel has been deleted.");
});

export const getHotel = asyncHandler(async (req, res, next) => {
  const hotelId = req.params.id;

  // Check if the hotel ID is provided
  if (!hotelId) {
    return res.status(400).json({ message: "Hotel ID not provided." });
  }

  // Find the hotel by the given ID
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    return res.status(404).json({ message: "Hotel not found." });
  }

  res.status(200).json(hotel);
});

export const getHotels = asyncHandler(async (req, res, next) => {
  const { min, max, ...others } = req.query;
  const hotels = await Hotel.find({
    ...others,
    cheapestPrice: { $gt: min | 1, $lt: max || 999 },
  }).limit(req.query.limit);
  res.status(200).json(hotels);
});

export const countByCity = asyncHandler(async (req, res, next) => {
  const cities = req.query.cities ? req.query.cities.split(",") : [];

  if (cities.length === 0) {
    return res
      .status(400)
      .json({ message: "No cities provided for counting." });
  }

  const list = await Promise.all(
    cities.map((city) => {
      return Hotel.countDocuments({ city: city });
    })
  );
  res.status(200).json(list);
});

export const countByType = asyncHandler(async (req, res, next) => {
  const hotelCount = await Hotel.countDocuments({ type: "hotel" });
  const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
  const resortCount = await Hotel.countDocuments({ type: "resort" });
  const villaCount = await Hotel.countDocuments({ type: "villa" });
  const cabinCount = await Hotel.countDocuments({ type: "cabin" });

  res.status(200).json([
    { type: "hotel", count: hotelCount },
    { type: "apartments", count: apartmentCount },
    { type: "resorts", count: resortCount },
    { type: "villas", count: villaCount },
    { type: "cabins", count: cabinCount },
  ]);
});

export const getHotelRooms = asyncHandler(async (req, res, next) => {
  const hotelId = req.params.id;

  // Check if the hotel with the given ID exists
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    return res.status(404).json({ message: "Hotel not found." });
  }

  // Hotel exists, proceed with fetching the rooms
  const list = await Promise.all(
    hotel.rooms.map((room) => {
      return Room.findById(room);
    })
  );
  res.status(200).json(list);
});
