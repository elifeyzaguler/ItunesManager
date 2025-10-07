const {
  getAllTracks,
  getTracksByArtistId,
  getTracksByAlbumId,
  addTrackFromDatabase,
  updateTrackFromDatabase,
  deleteTrackFromDatabase,
} = require("../Repositories/trackRepository");

const fetchTracks = async (req, res, next) => {
  try {
    const tracks = await getAllTracks();
    res.status(200).json(tracks);
  } catch (err) {
    next(err); // Pass the error to the middleware
  }
};

const fetchTracksByArtistId = async (req, res, next) => {
  try {
    const { id } = req.params; // Extract 'id' from query string
    if (!id) {
      return res.status(400).json({ error: "Artist ID is required" });
    }
    const tracks = await getTracksByArtistId(id);
    res.status(200).json(tracks);
  } catch (err) {
    next(err); // Pass the error to the middleware
  }
};

const fetchTracksByAlbumId = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Artist ID is required" });
    }
    const tracks = await getTracksByAlbumId(id);
    res.status(200).json(tracks);
  } catch (err) {
    next(err); // Pass the error to the middleware
  }
};

const addTrack = async (req, res, next) => {
  try {
    const {
      track_name,
      album_id,
      mediaTypeId,
      genreId,
      composer,
      seconds,
      unit_price,
    } = req.body;

    // Validate required fields
    if (!track_name || !unit_price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (
      (isNaN(parseInt(album_id)) &&
        album_id !== undefined &&
        album_id !== null) ||
      (isNaN(parseInt(mediaTypeId)) &&
        mediaTypeId !== undefined &&
        mediaTypeId !== null) ||
      (isNaN(parseInt(genreId)) && genreId !== undefined && genreId !== null) ||
      (isNaN(parseInt(seconds)) && genreId !== undefined && genreId !== null) ||
      (isNaN(parseFloat(unit_price)) &&
        genreId !== undefined &&
        genreId !== null)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid input: numeric values required" });
    }

    const trackData = {
      name: track_name,
      albumId: parseInt(album_id) || 348,
      mediaTypeId: parseInt(mediaTypeId) || 1,
      genreId: parseInt(genreId) || 1,
      composer: composer || null,
      milliseconds: parseInt(seconds * 1000) || 0,
      unitPrice: parseFloat(unit_price),
    };

    const newTrack = await addTrackFromDatabase(trackData);

    res
      .status(201)
      .json({ message: "Track added successfully", track: newTrack });
  } catch (err) {
    next(err);
  }
};

const updateTrack = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      track_name,
      album_id,
      mediaTypeId,
      genreId,
      composer,
      milliseconds,
      bytes,
      unitPrice,
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Track ID is required" });
    }

    const updatedFields = {};
    if (track_name) updatedFields.name = track_name;
    if (album_id) updatedFields.album_id = album_id;
    if (mediaTypeId) updatedFields.media_type_id = mediaTypeId;
    if (genreId) updatedFields.genre_id = genreId;
    if (composer) updatedFields.composer = composer;
    if (milliseconds) updatedFields.milliseconds = milliseconds;
    if (bytes) updatedFields.bytes = bytes;
    if (unitPrice) updatedFields.unit_price = unitPrice;

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    const updatedTrack = await updateTrackFromDatabase(id, updatedFields);

    // If track not found
    if (!updatedTrack) {
      return res.status(404).json({ error: "Track not found" });
    }

    res
      .status(200)
      .json({ message: "Track updated successfully", track: updatedTrack });
  } catch (err) {
    next(err);
  }
};

const deleteTrack = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Track ID is required" });
    }

    const deletedTrack = await deleteTrackFromDatabase(id);

    if (!deletedTrack) {
      return res.status(404).json({ error: "Track not found" });
    }

    res.status(200).json({
      message: "Track deleted successfully",
      track: deletedTrack,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  fetchTracks,
  fetchTracksByArtistId,
  fetchTracksByAlbumId,
  addTrack,
  updateTrack,
  deleteTrack,
};
