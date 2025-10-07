const pool = require("../Config/db");

const getAllAlbums = async () => {
  const query = `
    SELECT 
      album.*,
      artist.name AS artist_name
    FROM 
      album
    INNER JOIN 
      artist 
    ON 
      album.artist_id = artist.artist_id
    ORDER BY 
      album.title;
  `;
  const { rows } = await pool.query(query);
  return rows;
};

const getAlbumsByArtistId = async (artistId) => {
  const values = [artistId];
  const query = `SELECT album.album_id, album.title AS album_title, album.artist_id, artist.name AS artist_name
    FROM album 
    JOIN artist ON album.artist_id = artist.artist_id
    WHERE album.artist_id = $1
    ORDER BY album.title;`;
  const { rows } = await pool.query(query, values);
  return rows;
};

const getAlbumByAlbumId = async (albumId) => {
  const values = [albumId];
  const query = `SELECT * 
                FROM album
                WHERE album.album_id = $1;`;
  const { rows } = await pool.query(query, values);
  return rows;
};

const addAlbumToDatabase = async (albumData) => {
  const { title, artist_id } = albumData;

  const query = `
    INSERT INTO album (title, artist_id)
    VALUES ($1, $2)
    RETURNING *; 
  `;

  const values = [title, artist_id];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const updateAlbumInDatabase = async (id, updatedFields) => {
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
    UPDATE album
    SET ${fieldsToUpdate.join(", ")}
    WHERE album_id = $${values.length}
    RETURNING *; 
  `;

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deleteAlbumFromDatabase = async (id) => {
  const values = [id];
  const query = `
      DELETE FROM album
      WHERE album_id = $1
      RETURNING *;
    `;

  const { rows } = await pool.query(query, values);
  return rows[0];
};

module.exports = {
  getAllAlbums,
  getAlbumsByArtistId,
  getAlbumByAlbumId,
  addAlbumToDatabase,
  updateAlbumInDatabase,
  deleteAlbumFromDatabase,
};
