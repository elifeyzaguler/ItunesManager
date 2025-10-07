const {
  getAllArtists,
  getArtistById,
  addArtistToDatabase,
  updateArtistInDatabase,
  deleteArtistFromDatabase,
} = require("../Repositories/artistRepository");

const fetchArtists = async (req, res, next) => {
  try {
    const artists = await getAllArtists();
    res.status(200).json(artists);
  } catch (err) {
    next(err);
  }
};

const fetchArtistById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Artist ID is required" });
    }
    const artist = await getArtistById(id);
    if (!artist || artist.length == 0) {
      res.status(404).json("Artist not found.");
    }
    res.status(200).json(artist);
  } catch (err) {
    next(err);
  }
};

const addArtist = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Artist name is required" });
    }

    const newArtist = await addArtistToDatabase({ name });

    res.status(201).json({
      message: "Artist added successfully",
      artist: newArtist,
    });
  } catch (err) {
    next(err);
  }
};

const updateArtist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Artist ID is required" });
    }

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Artist name cannot be empty" });
    }

    const updatedArtist = await updateArtistInDatabase(id, { name });

    if (!updatedArtist) {
      return res.status(404).json({ error: "Artist not found" });
    }

    res.status(200).json({
      message: "Artist updated successfully",
      artist: updatedArtist,
    });
  } catch (err) {
    next(err);
  }
};

const deleteArtist = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Artist ID is required" });
    }

    const deletedArtist = await deleteArtistFromDatabase(id);

    if (!deletedArtist) {
      return res.status(404).json({ error: "Artist not found" });
    }

    res.status(200).json({
      message: "Artist deleted successfully",
      artist: deletedArtist,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  fetchArtists,
  fetchArtistById,
  addArtist,
  updateArtist,
  deleteArtist,
};
