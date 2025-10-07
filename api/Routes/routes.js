const express = require("express");
const {
  fetchArtists,
  fetchArtistById,
  addArtist,
  updateArtist,
  deleteArtist,
} = require("../Controllers/artistController");

const {
  fetchAlbums,
  fetchAlbumsByArtistId,
  fetchAlbumsByAlbumId,
  addAlbum,
  updateAlbum,
  deleteAlbum,
} = require("../Controllers/albumController");

const {
  fetchTracks,
  fetchTracksByArtistId,
  fetchTracksByAlbumId,
  addTrack,
  updateTrack,
  deleteTrack,
} = require("../Controllers/trackController");

const {
  fetchPlaylists,
  fetchPlaylistByPlaylistId,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  getTracksInPlaylist,
  addTracksToPlaylist,
  removeTrackFromPlaylist,
} = require("../Controllers/playlistController");

const {
  getAllEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../Controllers/employeeController");
const {
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getAllCustomers,
} = require("../Controllers/customerController");
const { getDashboardStats } = require("../Controllers/adminStatsController");

const router = express.Router();

router.get("/artists", fetchArtists); //Get all artists
router.get("/artists/:id", fetchArtistById); //Get artist by artistId
router.post("/artists/add", addArtist); //Add artist
router.put("/artists/update/:id", updateArtist); //Update artist
router.delete("/artists/delete/:id", deleteArtist); //Delete artist

router.get("/albums", fetchAlbums); //Get all albums
router.get("/albums/artist", fetchAlbumsByArtistId); //Get albums by artistId
router.get("/albums/:id", fetchAlbumsByAlbumId); //Get albums by albumId
router.post("/albums/add", addAlbum); //Add album
router.put("/albums/update/:id", updateAlbum); //Update album
router.delete("/albums/delete/:id", deleteAlbum); //Delete album

router.get("/tracks", fetchTracks); //Get all tracks
router.get("/tracks/artist/:id", fetchTracksByArtistId); //Get tracks by artistId
router.get("/tracks/album/:id", fetchTracksByAlbumId); //Get tracks by albumId

router.post("/tracks/add", addTrack); //Add track
router.put("/tracks/update/:id", updateTrack); //Update track
router.delete("/tracks/delete/:id", deleteTrack); //Delete track

router.get("/playlists", fetchPlaylists); //Get all playlists
router.get("/playlists/:id", fetchPlaylistByPlaylistId); //Get playlist by playlistId
router.post("/playlists/add", createPlaylist); //Add new playlists
router.put("/playlists/update/:id", updatePlaylist); //Update playlist
router.delete("/playlists/delete/:id", deletePlaylist); //Delete playlist with the tracks inside
router.post("/playlists/:id/tracks/add", addTracksToPlaylist); //Add track to playlist
router.get("/playlists/:id/tracks", getTracksInPlaylist); //Get all tracks in a playlist
router.delete(
  "/playlists/:playlistId/tracks/:trackId/delete",
  removeTrackFromPlaylist
); //Remove track from playlist

router.get("/employees", getAllEmployees); //Get all employees
router.post("/employees/add", addEmployee); //Add employee
router.put("/employees/update/:id", updateEmployee); //Update employee
router.delete("/employees/delete/:id", deleteEmployee); //Delete employee

router.get("/customers", getAllCustomers); //Get all customers
router.post("/customers/add", addCustomer); //Add customer
router.put("/customers/update/:id", updateCustomer); //Update customer
router.delete("/customers/delete/:id", deleteCustomer); //Delete customer

router.get("/admin/stats", getDashboardStats); //Get dashboard stats

module.exports = router;
