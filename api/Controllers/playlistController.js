const {
  getAllPlaylists,
  getPlaylistsById,
  addPlaylistInDatabase,
  updatePlaylistInDatabase,
  deletePlaylistFromDatabase,
  addTracksToPlaylistInDatabase,
  getTracksInPlaylistFromDatabase,
  removeTrackFromPlaylistInDatabase,
} = require("../Repositories/playlistRepository");

const fetchPlaylists = async (req, res, next) => {
  try {
    const playlists = await getAllPlaylists();
    if (playlists.length == 0 || playlists == null) {
      res.status(404).json({ error: "Playlists don't exist" });
    }
    res.status(200).json(playlists);
  } catch (err) {
    next(err);
  }
};

const fetchPlaylistByPlaylistId = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "PlaylistId is required" });
    }
    const playlist = await getPlaylistsById(id);
    if (playlist.length == 0 || playlist == null) {
      res.status(404).json({ error: "Playlist doesn't exist" });
    }
    res.status(200).json(playlist);
  } catch (err) {}
};

const createPlaylist = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Playlist name is required" });
    }

    const newPlaylist = await addPlaylistInDatabase(name);
    res.status(201).json(newPlaylist);
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!id || !name) {
      return res
        .status(400)
        .json({ error: "Playlist ID and name are required" });
    }

    const updatedPlaylist = await updatePlaylistInDatabase(id, name);
    if (!updatedPlaylist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    res.status(200).json(updatedPlaylist);
  } catch (error) {
    console.error("Error updating playlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Playlist ID is required" });
    }

    const deletedPlaylist = await deletePlaylistFromDatabase(id);
    if (!deletedPlaylist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    res.status(200).json({
      message: "Playlist deleted successfully",
      playlist: deletedPlaylist,
    });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addTracksToPlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { trackIds } = req.body;

    if (!id || !Array.isArray(trackIds) || trackIds.length === 0) {
      return res
        .status(400)
        .json({ error: "Playlist ID and track IDs are required" });
    }

    const addedTracks = await addTracksToPlaylistInDatabase(id, trackIds);

    res.status(201).json({
      message: "Tracks added to playlist successfully",
      tracks: addedTracks,
    });
  } catch (error) {
    console.error("Error adding tracks to playlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTracksInPlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Playlist ID is required" });
    }

    const tracks = await getTracksInPlaylistFromDatabase(id);

    if (tracks.length === 0) {
      return res
        .status(404)
        .json({ error: "No tracks found in this playlist" });
    }

    res.status(200).json(tracks);
  } catch (error) {
    console.error("Error fetching tracks in playlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeTrackFromPlaylist = async (req, res) => {
  try {
    const { playlistId, trackId } = req.params;
    if (!playlistId || !trackId) {
      return res
        .status(400)
        .json({ error: "Playlist ID and Track ID are required" });
    }

    const removedTrack = await removeTrackFromPlaylistInDatabase(
      playlistId,
      trackId
    );

    if (!removedTrack) {
      return res.status(404).json({ error: "Track not found in the playlist" });
    }

    res.status(200).json({
      message: "Track removed from playlist successfully",
      track: removedTrack,
    });
  } catch (error) {
    console.error("Error removing track from playlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  fetchPlaylists,
  fetchPlaylistByPlaylistId,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addTracksToPlaylist,
  getTracksInPlaylist,
  removeTrackFromPlaylist,
};
