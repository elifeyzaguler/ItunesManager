import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [newCustomerData, setNewCustomerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    phone: "",
    country: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/customers");
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      const data = await response.json();

      if (data.customers && Array.isArray(data.customers)) {
        setCustomers(data.customers);
        setFilteredCustomers(data.customers);
      } else {
        throw new Error(
          "Invalid data format: expected 'customers' key with an array"
        );
      }
    } catch (err) {
      console.error(err.message);
      toast.error("Error fetching customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      setFilteredCustomers(
        customers.filter((customer) =>
          `${customer.first_name} ${customer.last_name}`
            .toLowerCase()
            .includes(query.toLowerCase())
        )
      );
    }
  };

  const handleAddCustomer = async () => {
    if (
      !newCustomerData.firstName ||
      !newCustomerData.lastName ||
      !newCustomerData.email
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/customers/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCustomerData),
      });

      if (!response.ok) {
        throw new Error("Failed to add customer");
      }

      const newCustomer = await response.json();
      setCustomers((prev) => [...prev, newCustomer]);
      setFilteredCustomers((prev) => [...prev, newCustomer]);
      setIsAddCustomerModalOpen(false);
      setNewCustomerData({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        phone: "",
        country: "",
      });
      toast.success("Customer added successfully!");
      await fetchCustomers();
    } catch (err) {
      console.error(err.message);
      toast.error("Error adding customer.");
    }
  };

  const handleEditCustomer = async () => {
    if (
      !currentCustomer.first_name ||
      !currentCustomer.last_name ||
      !currentCustomer.email
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/customers/update/${currentCustomer.customer_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentCustomer),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to edit customer");
      }

      const updatedCustomer = await response.json();
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.customer_id === updatedCustomer.customer_id
            ? updatedCustomer
            : customer
        )
      );
      setFilteredCustomers((prev) =>
        prev.map((customer) =>
          customer.customer_id === updatedCustomer.customer_id
            ? updatedCustomer
            : customer
        )
      );
      setIsEditCustomerModalOpen(false);
      setCurrentCustomer(null);
      toast.success("Customer edited successfully!");
      await fetchCustomers();
    } catch (err) {
      console.error(err.message);
      toast.error("Error editing customer.");
    }
  };

  const handleRemoveCustomer = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/customers/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove customer");
      }

      setCustomers((prev) =>
        prev.filter((customer) => customer.customer_id !== id)
      );
      setFilteredCustomers((prev) =>
        prev.filter((customer) => customer.customer_id !== id)
      );
      toast.success("Customer removed successfully!");
      await fetchCustomers();
      setSearchQuery("");
    } catch (err) {
      console.error(err.message);
      toast.error("Error removing customer.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-500">Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="w-full flex justify-end px-8 mt-6">
        <button
          onClick={() => setIsAddCustomerModalOpen(true)}
          className="px-4 py-2 bg-green-500 text-white font-bold rounded shadow-lg hover:bg-green-600 transition"
        >
          Add Customer
        </button>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl p-8 mt-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Customers
        </h1>

        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search for customers..."
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <ul className="space-y-4">
          {filteredCustomers.map((customer) => (
            <li
              key={customer.customer_id}
              className="p-5 bg-gradient-to-r from-gray-400 to-gray-200 text-white rounded-lg shadow-md flex flex-col md:flex-row md:items-center justify-between"
            >
              <div>
                <p className="text-lg font-semibold">
                  {customer.first_name} {customer.last_name}
                </p>
                <p className="text-base">Email: {customer.email}</p>
                <p className="text-base">
                  Company: {customer.company || "N/A"}
                </p>
                <p className="text-base">Phone: {customer.phone || "N/A"}</p>
                <p className="text-base">
                  Country: {customer.country || "N/A"}
                </p>
              </div>
              <div className="flex space-x-4 mt-2 md:mt-0">
                <button
                  onClick={() => {
                    setCurrentCustomer(customer);
                    setIsEditCustomerModalOpen(true);
                  }}
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleRemoveCustomer(customer.customer_id)}
                  className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isAddCustomerModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Add Customer</h2>
            <input
              type="text"
              value={newCustomerData.firstName}
              onChange={(e) =>
                setNewCustomerData({
                  ...newCustomerData,
                  firstName: e.target.value,
                })
              }
              placeholder="First Name"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <input
              type="text"
              value={newCustomerData.lastName}
              onChange={(e) =>
                setNewCustomerData({
                  ...newCustomerData,
                  lastName: e.target.value,
                })
              }
              placeholder="Last Name"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <input
              type="email"
              value={newCustomerData.email}
              onChange={(e) =>
                setNewCustomerData({
                  ...newCustomerData,
                  email: e.target.value,
                })
              }
              placeholder="Email"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <input
              type="text"
              value={newCustomerData.company}
              onChange={(e) =>
                setNewCustomerData({
                  ...newCustomerData,
                  company: e.target.value,
                })
              }
              placeholder="Company"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <input
              type="text"
              value={newCustomerData.phone}
              onChange={(e) =>
                setNewCustomerData({
                  ...newCustomerData,
                  phone: e.target.value,
                })
              }
              placeholder="Phone"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <input
              type="text"
              value={newCustomerData.country}
              onChange={(e) =>
                setNewCustomerData({
                  ...newCustomerData,
                  country: e.target.value,
                })
              }
              placeholder="Country"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsAddCustomerModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomer}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditCustomerModalOpen && currentCustomer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Edit Customer</h2>
            <input
              type="text"
              value={currentCustomer.first_name}
              onChange={(e) =>
                setCurrentCustomer({
                  ...currentCustomer,
                  first_name: e.target.value,
                })
              }
              placeholder="First Name"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <input
              type="text"
              value={currentCustomer.last_name}
              onChange={(e) =>
                setCurrentCustomer({
                  ...currentCustomer,
                  last_name: e.target.value,
                })
              }
              placeholder="Last Name"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <input
              type="email"
              value={currentCustomer.email}
              onChange={(e) =>
                setCurrentCustomer({
                  ...currentCustomer,
                  email: e.target.value,
                })
              }
              placeholder="Email"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <input
              type="text"
              value={currentCustomer.company || ""}
              onChange={(e) =>
                setCurrentCustomer({
                  ...currentCustomer,
                  company: e.target.value,
                })
              }
              placeholder="Company"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <input
              type="text"
              value={currentCustomer.phone || ""}
              onChange={(e) =>
                setCurrentCustomer({
                  ...currentCustomer,
                  phone: e.target.value,
                })
              }
              placeholder="Phone"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <input
              type="text"
              value={currentCustomer.country || ""}
              onChange={(e) =>
                setCurrentCustomer({
                  ...currentCustomer,
                  country: e.target.value,
                })
              }
              placeholder="Country"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsEditCustomerModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditCustomer}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomersPage;
