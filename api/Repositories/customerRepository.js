const pool = require("../Config/db");
const getAllCustomersFromDatabase = async () => {
  try {
    const query = `
        SELECT * FROM customer ORDER BY first_name ASC;
      `;

    const { rows } = await pool.query(query);

    return rows;
  } catch (error) {
    console.error("Error fetching customers from database:", error.message);
    throw new Error("Failed to fetch customers from the database");
  }
};

const addCustomerToDatabase = async (customerData) => {
  try {
    const {
      firstName,
      lastName,
      company,
      address,
      city,
      state,
      country,
      postalCode,
      phone,
      fax,
      email,
      supportRepId,
    } = customerData;

    const values = [
      firstName,
      lastName,
      company,
      address,
      city,
      state,
      country,
      postalCode,
      phone,
      fax,
      email,
      supportRepId,
    ];

    const query = `
        INSERT INTO customer (
          first_name,
          last_name,
          company,
          address,
          city,
          state,
          country,
          postal_code,
          phone,
          fax,
          email,
          support_rep_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
        ) RETURNING *;
      `;

    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    throw new Error("Failed to add customer to the database");
  }
};

const updateCustomerInDatabase = async (customerId, updatedData) => {
  try {
    const fields = Object.keys(updatedData);
    const values = Object.values(updatedData);

    if (fields.length === 0) {
      throw new Error("No fields to update provided.");
    }

    const setClause = fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(", ");
    const query = `
        UPDATE customer
        SET ${setClause}
        WHERE customer_id = $${fields.length + 1}
        RETURNING *;
      `;

    values.push(customerId);

    const { rows } = await pool.query(query, values);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error updating customer in database:", error.message);
    throw new Error("Failed to update customer in the database");
  }
};

const deleteCustomerFromDatabase = async (customerId) => {
  try {
    const query = `
        DELETE FROM customer
        WHERE customer_id = $1
        RETURNING *;
      `;

    const { rows } = await pool.query(query, [customerId]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error deleting customer from database:", error.message);
    throw new Error("Failed to delete customer from the database");
  }
};

module.exports = {
  getAllCustomersFromDatabase,
  addCustomerToDatabase,
  updateCustomerInDatabase,
  deleteCustomerFromDatabase,
};
