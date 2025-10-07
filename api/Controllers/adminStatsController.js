const {
  getTrackCount,
  getArtistCount,
  getAlbumCount,
  getCustomerCount,
  getPlaylistCount,
  getEmployeeCount,
  getInvoiceCount,
} = require("../Repositories/adminStatsRepository");

const getDashboardStats = async (req, res) => {
  try {
    const [tracks, artists, albums, customers, playlists, employees, invoices] =
      await Promise.all([
        getTrackCount(),
        getArtistCount(),
        getAlbumCount(),
        getCustomerCount(),
        getPlaylistCount(),
        getEmployeeCount(),
        getInvoiceCount(),
      ]);

    res.status(200).json({
      tracks,
      artists,
      albums,
      customers,
      playlists,
      employees,
      invoices,
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getDashboardStats,
};
