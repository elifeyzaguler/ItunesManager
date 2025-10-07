const {
  getAllEmployeesFromDatabase,
  addEmployeeToDatabase,
  updateEmployeeInDatabase,
  deleteEmployeeFromDatabase,
} = require("../Repositories/employeeRepository");

const getAllEmployees = async (req, res) => {
  try {
    const employees = await getAllEmployeesFromDatabase();
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching employees." });
  }
};

const addEmployee = async (req, res, next) => {
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
    } = req.body;

    if (!lastName || !firstName || !title) {
      return res.status(400).json({
        error:
          "Missing required fields: 'lastName', 'firstName', and 'title' are required.",
      });
    }

    if (
      (reportsTo !== undefined &&
        reportsTo !== null &&
        isNaN(parseInt(reportsTo))) ||
      (postalCode !== undefined &&
        postalCode !== null &&
        isNaN(parseInt(postalCode)))
    ) {
      return res.status(400).json({
        error:
          "Invalid input: numeric values required for 'reportsTo' and 'postalCode'.",
      });
    }

    const employeeData = {
      lastName,
      firstName,
      title,
      reportsTo: reportsTo ? parseInt(reportsTo) : null,
      birthDate: birthDate || null,
      hireDate: hireDate || null,
      address: address || null,
      city: city || null,
      state: state || null,
      country: country || null,
      postalCode: postalCode ? parseInt(postalCode) : null,
      phone: phone || null,
      fax: fax || null,
      email: email || null,
    };

    const newEmployee = await addEmployeeToDatabase(employeeData);

    res
      .status(200)
      .json({ message: "Employee added successfully", employee: newEmployee });
  } catch (err) {
    next(err);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      last_name,
      first_name,
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
    } = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res
        .status(400)
        .json({ error: "Valid Employee ID is required for updating." });
    }

    const updatedData = {};
    if (last_name) updatedData.last_name = last_name;
    if (first_name) updatedData.first_name = first_name;
    if (title) updatedData.title = title;
    if (reportsTo) updatedData.reports_to = parseInt(reportsTo);
    if (birthDate) updatedData.birth_date = birthDate;
    if (hireDate) updatedData.hire_date = hireDate;
    if (address) updatedData.address = address;
    if (city) updatedData.city = city;
    if (state) updatedData.state = state;
    if (country) updatedData.country = country;
    if (postalCode) updatedData.postal_code = parseInt(postalCode);
    if (phone) updatedData.phone = phone;
    if (fax) updatedData.fax = fax;
    if (email) updatedData.email = email;

    if (Object.keys(updatedData).length === 0) {
      return res
        .status(400)
        .json({ error: "No valid fields provided for updating." });
    }

    const updatedEmployee = await updateEmployeeInDatabase(
      parseInt(id),
      updatedData
    );

    if (!updatedEmployee) {
      return res.status(404).json({ error: "Employee not found." });
    }

    res.status(200).json({
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (err) {
    next(err);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res
        .status(400)
        .json({ error: "Valid Employee ID is required for deletion." });
    }

    const deletedEmployee = await deleteEmployeeFromDatabase(parseInt(id));

    if (!deletedEmployee) {
      return res.status(404).json({ error: "Employee not found." });
    }

    res.status(200).json({
      message: "Employee deleted successfully",
      employee: deletedEmployee,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};
