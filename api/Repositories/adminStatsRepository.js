const pool = require("../Config/db");

const getTrackCount = async () => {
  const result = await pool.query("SELECT COUNT(*) AS count FROM track");
  return parseInt(result.rows[0].count, 10);
};

const getArtistCount = async () => {
  const result = await pool.query("SELECT COUNT(*) AS count FROM artist");
  return parseInt(result.rows[0].count, 10);
};

const getAlbumCount = async () => {
  const result = await pool.query("SELECT COUNT(*) AS count FROM album");
  return parseInt(result.rows[0].count, 10);
};

const getCustomerCount = async () => {
  const result = await pool.query("SELECT COUNT(*) AS count FROM customer");
  return parseInt(result.rows[0].count, 10);
};

const getPlaylistCount = async () => {
  const result = await pool.query("SELECT COUNT(*) AS count FROM playlist");
  return parseInt(result.rows[0].count, 10);
};

const getEmployeeCount = async () => {
  const result = await pool.query("SELECT COUNT(*) AS count FROM employee");
  return parseInt(result.rows[0].count, 10);
};

const getInvoiceCount = async () => {
  const result = await pool.query("SELECT COUNT(*) AS count FROM invoice");
  return parseInt(result.rows[0].count, 10);
};

module.exports = {
  getTrackCount,
  getArtistCount,
  getAlbumCount,
  getCustomerCount,
  getPlaylistCount,
  getEmployeeCount,
  getInvoiceCount,
};
