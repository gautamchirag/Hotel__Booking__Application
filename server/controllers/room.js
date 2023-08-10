import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import asyncHandler from "express-async-handler";

export const createRoom = asyncHandler(async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const { title, price, maxPeople, desc, roomNumbers } = req.body;

  // Check if all required fields are present
  if (
    !title ||
    !price ||
    !maxPeople ||
    !desc ||
    !roomNumbers ||
    roomNumbers.length === 0 ||
    !hotelId
  ) {
    return res.status(400).json({
      message:
        "All fields (title, price, maxPeople, desc, roomNumbers) are required.",
    });
  }

  const savedRoom = await newRoom.save();

  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    return res.status(404).json({ message: "Hotel not found." });
  }

  // Check if the new room's price is lower than the hotel's current cheapest price
  if (savedRoom.price < hotel.cheapestPrice) {
    hotel.cheapestPrice = newRoom.price;
    await hotel.save();
  }

  await Hotel.findByIdAndUpdate(hotelId, {
    $push: { rooms: savedRoom._id },
  });

  res.status(200).json(savedRoom);
});

export const updateRoom = asyncHandler(async (req, res, next) => {
  const roomId = req.params.id;
  const updatedData = req.body;

  // Check if the room with the given ID exists
  const room = await Room.findById(roomId);
  if (!room) {
    return res.status(404).json({ message: "Room not found." });
  }

  const updatedRoom = await Room.findByIdAndUpdate(
    roomId,
    { $set: updatedData },
    { new: true }
  );

  const hotel = await Hotel.findById(room.hotelId);

  // Check if the updated room's price is lower than the hotel's current cheapest price
  if (updatedData.price < hotel.cheapestPrice) {
    hotel.cheapestPrice = updatedData.price;
    await hotel.save();
  }

  res.status(200).json(updatedRoom);
});

export const updateRoomAvailability = asyncHandler(async (req, res, next) => {
  const roomId = req.params.id;
  const { dates } = req.body;

  // Check if the room with the given ID exists
  const room = await Room.findById(roomId);
  if (!room) {
    return res.status(404).json({ message: "Room not found." });
  }

  if (!dates || !Array.isArray(dates) || dates.length === 0) {
    return res
      .status(400)
      .json({ message: "Invalid or empty 'dates' array provided." });
  }

  await Room.updateOne(
    { "roomNumbers._id": roomId },
    {
      $push: {
        "roomNumbers.$.unavailableDates": dates,
      },
    }
  );
  res.status(200).json("Room status has been updated.");
});

export const deleteRoom = asyncHandler(async (req, res, next) => {
  const roomId = req.params.id;

  // Check if the room with the given ID exists
  const room = await Room.findById(roomId);
  if (!room) {
    return res.status(404).json({ message: "Room not found." });
  }

  const hotelId = req.params.hotelid;
  await Room.findByIdAndDelete(roomId);

  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    return res.status(404).json({ message: "Hotel not found." });
  }

  await Hotel.findByIdAndUpdate(hotelId, {
    $pull: { rooms: roomId },
  });

  res.status(200).json("Room has been deleted.");
});

export const getRoom = asyncHandler(async (req, res, next) => {
  const roomId = req.params.id;

  // Check if the room with the given ID exists
  const room = await Room.findById(roomId);
  if (!room) {
    return res.status(404).json({ message: "Room not found." });
  }

  res.status(200).json(room);
});

export const getRooms = asyncHandler(async (req, res, next) => {
  const hotelid = req.params;
  const rooms = await Room.find({ hotelId: hotelid });
  res.status(200).json(rooms);
});
