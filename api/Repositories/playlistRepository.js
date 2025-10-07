const pool = require("../Config/db");

const getAllPlaylists = async () => {
  const query = `SELECT * FROM playlist ORDER BY playlist_id;`;
  const { rows } = await pool.query(query);
  return rows;
};

const getPlaylistsById = async (playlistId) => {
  const values = [playlistId];
  const query = `SELECT * 
                FROM playlist
                WHERE playlist_id = $1`;
  const { rows } = await pool.query(query, values);
  return rows;
};

const addPlaylistInDatabase = async (playlistName) => {
  const query = `INSERT INTO playlist (name) VALUES ($1) RETURNING *;`;
  const values = [playlistName];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const updatePlaylistInDatabase = async (playlistId, playlistName) => {
  const query = `
    UPDATE playlist 
    SET name = $1
    WHERE playlist_id = $2 
    RETURNING *;
  `;
  const values = [playlistName, playlistId];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deletePlaylistFromDatabase = async (playlistId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const deleteTracksQuery = `
      DELETE FROM playlist_track 
      WHERE playlist_id = $1;
    `;
    await client.query(deleteTracksQuery, [playlistId]);

    const deletePlaylistQuery = `
      DELETE FROM playlist 
      WHERE playlist_id = $1 
      RETURNING *;
    `;
    const { rows } = await client.query(deletePlaylistQuery, [playlistId]);

    await client.query("COMMIT");
    return rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const addTracksToPlaylistInDatabase = async (playlistId, trackIds) => {
  const query = `
    INSERT INTO playlist_track (playlist_id, track_id)
    VALUES ($1, $2)
    RETURNING *;
  `;

  const addedTracks = [];
  for (const trackId of trackIds) {
    const values = [playlistId, trackId];
    const { rows } = await pool.query(query, values);
    addedTracks.push(rows[0]);
  }
  return addedTracks;
};

const getTracksInPlaylistFromDatabase = async (playlistId) => {
  const query = `
    SELECT 
      t.track_id, 
      t.name AS track_name, 
      t.album_id, 
      a.title AS album_title, 
      ar.name AS artist_name, 
      t.milliseconds 
    FROM 
      playlist_track pt
    INNER JOIN 
      track t ON pt.track_id = t.track_id
    INNER JOIN 
      album a ON t.album_id = a.album_id
    INNER JOIN 
      artist ar ON a.artist_id = ar.artist_id
    WHERE 
      pt.playlist_id = $1;
  `;
  const values = [playlistId];
  const { rows } = await pool.query(query, values);
  return rows;
};

const removeTrackFromPlaylistInDatabase = async (playlistId, trackId) => {
  const query = `
    DELETE FROM playlist_track
    WHERE playlist_id = $1 AND track_id = $2
    RETURNING *;
  `;
  const values = [playlistId, trackId];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

module.exports = {
  getAllPlaylists,
  getPlaylistsById,
  addPlaylistInDatabase,
  updatePlaylistInDatabase,
  deletePlaylistFromDatabase,
  addTracksToPlaylistInDatabase,
  getTracksInPlaylistFromDatabase,
  removeTrackFromPlaylistInDatabase,
};
