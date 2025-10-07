const pool = require("../Config/db");

const getAllArtists = async () => {
  const query = "SELECT * FROM artist ORDER BY name;";
  const { rows } = await pool.query(query);
  return rows;
};

const getArtistById = async (id) => {
  const values = [id];
  const query =
    "SELECT * FROM artist WHERE artist.artist_id = $1 ORDER BY name;";
  const { rows } = await pool.query(query, values);
  return rows;
};

const addArtistToDatabase = async (artistData) => {
  const { name } = artistData;
  const values = [name];

  const query = `
    INSERT INTO artist (name)
    VALUES ($1)
    RETURNING *;
  `;

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const updateArtistInDatabase = async (id, updatedFields) => {
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
    UPDATE artist
    SET ${fieldsToUpdate.join(", ")}
    WHERE artist_id = $${values.length}
    RETURNING *; 
  `;

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deleteArtistFromDatabase = async (id) => {
  const query = `
    DELETE FROM artist
    WHERE artist_id = $1
    RETURNING *; 
  `;

  const values = [id];
  const { rows } = await pool.query(query, values);

  return rows[0];
};

module.exports = {
  getAllArtists,
  getArtistById,
  addArtistToDatabase,
  updateArtistInDatabase,
  deleteArtistFromDatabase,
};
