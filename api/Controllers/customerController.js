const {
  getAllCustomersFromDatabase,
  addCustomerToDatabase,
  updateCustomerInDatabase,
  deleteCustomerFromDatabase,
} = require("../Repositories/customerRepository");

const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await getAllCustomersFromDatabase();

    res.status(200).json({ customers });
  } catch (err) {
    next(err);
  }
};

const addCustomer = async (req, res, next) => {
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
    } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        error:
          "Missing required fields: 'firstName', 'lastName', and 'email' are required.",
      });
    }

    if (
      (supportRepId !== undefined &&
        supportRepId !== null &&
        isNaN(parseInt(supportRepId))) ||
      (postalCode !== undefined &&
        postalCode !== null &&
        isNaN(parseInt(postalCode)))
    ) {
      return res.status(400).json({
        error:
          "Invalid input: numeric values required for 'supportRepId' and 'postalCode'.",
      });
    }

    const customerData = {
      firstName,
      lastName,
      company: company || null,
      address: address || null,
      city: city || null,
      state: state || null,
      country: country || null,
      postalCode: postalCode ? parseInt(postalCode) : null,
      phone: phone || null,
      fax: fax || null,
      email,
      supportRepId: supportRepId ? parseInt(supportRepId) : null,
    };

    const newCustomer = await addCustomerToDatabase(customerData);

    res.status(201).json({
      message: "Customer added successfully",
      customer: newCustomer,
    });
  } catch (err) {
    next(err);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
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
    } = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res
        .status(400)
        .json({ error: "Valid Customer ID is required for updating." });
    }

    const updatedData = {};
    if (first_name) updatedData.first_name = first_name;
    if (last_name) updatedData.last_name = last_name;
    if (company) updatedData.company = company;
    if (address) updatedData.address = address;
    if (city) updatedData.city = city;
    if (state) updatedData.state = state;
    if (country) updatedData.country = country;
    if (postalCode) updatedData.postal_code = parseInt(postalCode);
    if (phone) updatedData.phone = phone;
    if (fax) updatedData.fax = fax;
    if (email) updatedData.email = email;
    if (supportRepId) updatedData.support_rep_id = parseInt(supportRepId);

    if (Object.keys(updatedData).length === 0) {
      return res
        .status(400)
        .json({ error: "No valid fields provided for updating." });
    }

    const updatedCustomer = await updateCustomerInDatabase(
      parseInt(id),
      updatedData
    );

    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found." });
    }

    res.status(200).json({
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (err) {
    next(err);
  }
};

const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res
        .status(400)
        .json({ error: "Valid Customer ID is required for deletion." });
    }

    const deletedCustomer = await deleteCustomerFromDatabase(parseInt(id));

    if (!deletedCustomer) {
      return res.status(404).json({ error: "Customer not found." });
    }

    res.status(200).json({
      message: "Customer deleted successfully",
      customer: deletedCustomer,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
};
