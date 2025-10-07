const {
  getAllAlbums,
  getAlbumsByArtistId,
  getAlbumByAlbumId,
  addAlbumToDatabase,
  updateAlbumInDatabase,
  deleteAlbumFromDatabase,
} = require("../Repositories/albumRepository");

const fetchAlbums = async (req, res, next) => {
  try {
    const albums = await getAllAlbums();
    res.status(200).json(albums);
  } catch (err) {
    next(err);
  }
};

const fetchAlbumsByArtistId = async (req, res, next) => {
  try {
    const { artistId } = req.query;
    if (!artistId) {
      return res.status(400).json({ error: "Artist ID is required" });
    }
    const albums = await getAlbumsByArtistId(artistId);
    res.status(200).json(albums);
  } catch (err) {
    next(err);
  }
};

const fetchAlbumsByAlbumId = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Album ID is required" });
    }
    const album = await getAlbumByAlbumId(id);
    res.status(200).json(album);
  } catch (err) {
    next(err);
  }
};

const addAlbum = async (req, res, next) => {
  try {
    let { title, artist_id } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Album title is required" });
    }
    if (!artist_id || artist_id == undefined) {
      artist_id = 276; //No artist value
    }

    if (isNaN(parseInt(artist_id))) {
      return res.status(400).json({ error: "Artist ID is not valid" });
    }
    const newAlbum = await addAlbumToDatabase({ title, artist_id });

    res.status(201).json({
      message: "Album added successfully",
      album: newAlbum,
    });
  } catch (err) {
    next(err);
  }
};

const updateAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, artist_id } = req.body;

    if (!id) {
      return res.status(400).json("Album ID is required.");
    }

    const updatedFields = {};
    if (title) {
      updatedFields.title = title;
    }
    if (artist_id) {
      updatedFields.artist_id = artist_id;
    }

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    const updatedAlbum = await updateAlbumInDatabase(id, updatedFields);
    if (!updatedAlbum) {
      return res.status(400).json("Album not found.");
    }

    res.status(200).json({
      message: "Album updated successfully",
      artist: updatedAlbum,
    });
  } catch (err) {
    next(err);
  }
};

const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json("Album ID is required.");
    }

    const deletedAlbum = await deleteAlbumFromDatabase(id);
    if (!deletedAlbum) {
      return res.status(400).json("Album not found.");
    }

    return res.status(200).json({
      message: "Album deleted successfully",
      album: deletedAlbum,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  fetchAlbums,
  fetchAlbumsByArtistId,
  fetchAlbumsByAlbumId,
  addAlbum,
  updateAlbum,
  deleteAlbum,
};
