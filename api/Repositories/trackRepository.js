const pool = require("../Config/db");

const getAllTracks = async () => {
  const query = `SELECT 
                    track.track_id, 
                    track.name AS track_name, 
                    track.album_id,
                    album.title AS album_title,
                    track.composer, 
                    artist.name AS artist_name,
                    genre.name AS track_genre,
                    track.milliseconds, 
                    track.unit_price
                FROM 
                    track
                JOIN 
                    genre ON track.genre_id = genre.genre_id
                JOIN 
                    album ON track.album_id = album.album_id
                JOIN 
                    artist ON album.artist_id = artist.artist_id
                ORDER BY track.name ASC;
                `;
  const { rows } = await pool.query(query);
  return rows;
};

const getTracksByArtistId = async (artistId) => {
  const values = [artistId];
  const query = `SELECT 
                    track.track_id, 
                    track.name AS track_name, 
                    track.album_id, 
                    album.title AS album_title,
                    track.composer,
                    artist.name AS artist_name,
                    genre.name AS track_genre,
                    track.milliseconds, 
                    track.unit_price
                FROM 
                    track
                JOIN 
                    album ON track.album_id = album.album_id
                JOIN 
                    genre ON track.genre_id = genre.genre_id
				JOIN 
    				artist ON album.artist_id = artist.artist_id
                WHERE 
                    track.album_id IN (
                        SELECT album.album_id
                        FROM album
                        WHERE album.artist_id = $1
                    );
                ;`;
  const { rows } = await pool.query(query, values);
  return rows;
};

const getTracksByAlbumId = async (albumId) => {
  const values = [albumId];
  const query = `SELECT 
                    track.track_id, 
                    track.name AS track_name, 
                    track.album_id, 
                    album.title AS album_title,
                    track.composer, 
                    artist.name AS artist_name,
                    genre.name AS track_genre,
                    track.milliseconds, 
                    track.unit_price
                FROM 
                    track
                JOIN 
                    genre ON track.genre_id = genre.genre_id
                JOIN 
                    album ON track.album_id = album.album_id
                JOIN 
                    artist ON album.artist_id = artist.artist_id
                WHERE 
                    track.album_id = $1;
                `;
  const { rows } = await pool.query(query, values);
  return rows;
};

const addTrackFromDatabase = async (trackData) => {
  const {
    name,
    albumId,
    mediaTypeId,
    genreId,
    composer,
    milliseconds,
    unitPrice,
  } = trackData;
  const values = [
    name,
    albumId,
    mediaTypeId,
    genreId,
    composer,
    milliseconds,
    unitPrice,
  ];
  const query = `INSERT INTO track (name, album_id, media_type_id, genre_id, composer, milliseconds, bytes, unit_price)
                    VALUES (
                        $1,      
                        $2,                 
                        $3,                 
                        $4,             
                        $5,  
                        $6,         
                        NULL,         
                        $7          
                    ) RETURNING *;
                    `;
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const updateTrackFromDatabase = async (id, updatedFields) => {
  const fieldsToUpdate = [];
  const values = [];

  Object.entries(updatedFields).forEach(([key, value], index) => {
    fieldsToUpdate.push(`${key} = $${index + 1}`);
    values.push(value);
  });

  if (fieldsToUpdate.length === 0) {
    throw new Error("No fields provided for update");
  }

  values.push(id);

  const query = `
    UPDATE track
    SET ${fieldsToUpdate.join(", ")}
    WHERE track_id = $${values.length}
    RETURNING *;
  `;

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deleteTrackFromDatabase = async (id) => {
  const query = `
      DELETE FROM track
      WHERE track_id = $1
      RETURNING *;
    `;

  const values = [id];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

module.exports = {
  getAllTracks,
  getTracksByArtistId,
  getTracksByAlbumId,
  addTrackFromDatabase,
  updateTrackFromDatabase,
  deleteTrackFromDatabase,
};
