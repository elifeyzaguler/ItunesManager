const pool = require("../Config/db");

const getAllEmployeesFromDatabase = async () => {
  const query = "SELECT * FROM employee ORDER BY first_name ASC";
  const { rows } = await pool.query(query);
  return rows;
};

const addEmployeeToDatabase = async (employeeData) => {
  try {
    const {
      lastName,
      firstName,
      title,
      reportsTo,
      birthDate,
      hireDate,
      address,
      city,
      state,
      country,
      postalCode,
      phone,
      fax,
      email,
    } = employeeData;

    const values = [
      lastName,
      firstName,
      title,
      reportsTo,
      birthDate,
      hireDate,
      address,
      city,
      state,
      country,
      postalCode,
      phone,
      fax,
      email,
    ];

    const query = `
        INSERT INTO employee (
          last_name,
          first_name,
          title,
          reports_to,
          birth_date,
          hire_date,
          address,
          city,
          state,
          country,
          postal_code,
          phone,
          fax,
          email
        ) VALUES (
          $1, -- Last Name
          $2, -- First Name
          $3, -- Title
          $4, -- Reports To (Supervisor)
          $5, -- Birth Date
          $6, -- Hire Date
          $7, -- Address
          $8, -- City
          $9, -- State
          $10, -- Country
          $11, -- Postal Code
          $12, -- Phone
          $13, -- Fax
          $14  -- Email
        ) RETURNING *;
      `;

    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error("Error adding employee to database:", error.message);
    throw new Error("Failed to add employee to the database");
  }
};

const updateEmployeeInDatabase = async (employeeId, updatedData) => {
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
        UPDATE employee
        SET ${setClause}
        WHERE employee_id = $${fields.length + 1}
        RETURNING *;
      `;

    values.push(employeeId);

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error("Error updating employee in database:", error.message);
    throw new Error("Failed to update employee in the database");
  }
};

const deleteEmployeeFromDatabase = async (employeeId) => {
  try {
    const query = `
        DELETE FROM employee
        WHERE employee_id = $1
        RETURNING *;
      `;

    const { rows } = await pool.query(query, [employeeId]);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error("Error deleting employee from database:", error.message);
    throw new Error("Failed to delete employee from the database");
  }
};

module.exports = {
  getAllEmployeesFromDatabase,
  addEmployeeToDatabase,
  updateEmployeeInDatabase,
  deleteEmployeeFromDatabase,
};
