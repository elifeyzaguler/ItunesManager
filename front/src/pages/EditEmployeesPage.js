import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const AdminEmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [newEmployeeData, setNewEmployeeData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    title: "",
    phone: "",
    country: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(5);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/employees");
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }
      const employees = await response.json();

      if (employees && Array.isArray(employees)) {
        setEmployees(employees);
        setFilteredEmployees(employees);
      } else {
        throw new Error(
          "Invalid data format: expected 'employees' key with an array"
        );
      }
    } catch (err) {
      console.error(err.message);
      toast.error("Error fetching employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      setFilteredEmployees(
        employees.filter((employee) =>
          `${employee.first_name} ${employee.last_name}`
            .toLowerCase()
            .includes(query.toLowerCase())
        )
      );
    }
  };

  const handleAddEmployee = async () => {
    if (
      !newEmployeeData.firstName ||
      !newEmployeeData.lastName ||
      !newEmployeeData.email
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/employees/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEmployeeData),
      });

      if (!response.ok) {
        throw new Error("Failed to add employee");
      }

      const newEmployee = await response.json();
      setEmployees((prev) => [...prev, newEmployee]);
      setFilteredEmployees((prev) => [...prev, newEmployee]);
      setIsAddEmployeeModalOpen(false);
      setNewEmployeeData({
        firstName: "",
        lastName: "",
        email: "",
        department: "",
        phone: "",
        country: "",
      });
      toast.success("Employee added successfully!");
      await fetchEmployees();
    } catch (err) {
      console.error(err.message);
      toast.error("Error adding employee.");
    }
  };

  const handleEditEmployee = async () => {
    if (
      !currentEmployee.first_name ||
      !currentEmployee.last_name ||
      !currentEmployee.email
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/employees/update/${currentEmployee.employee_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentEmployee),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to edit employee");
      }

      const updatedEmployee = await response.json();
      setEmployees((prev) =>
        prev.map((employee) =>
          employee.employee_id === updatedEmployee.employee_id
            ? updatedEmployee
            : employee
        )
      );
      setFilteredEmployees((prev) =>
        prev.map((employee) =>
          employee.employee_id === updatedEmployee.employee_id
            ? updatedEmployee
            : employee
        )
      );
      setIsEditEmployeeModalOpen(false);
      setCurrentEmployee(null);
      toast.success("Employee edited successfully!");
      await fetchEmployees();
      setSearchQuery("");
    } catch (err) {
      console.error(err.message);
      toast.error("Error editing employee.");
    }
  };

  const handleRemoveEmployee = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/employees/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove employee");
      }

      setEmployees((prev) =>
        prev.filter((employee) => employee.employee_id !== id)
      );
      setFilteredEmployees((prev) =>
        prev.filter((employee) => employee.employee_id !== id)
      );
      toast.success("Employee removed successfully!");
      await fetchEmployees();
      setSearchQuery("");
    } catch (err) {
      console.error(err.message);
      toast.error("Error removing employee.");
    }
  };

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-500">Loading employees...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="w-full flex justify-end px-8 mt-6">
        <button
          onClick={() => setIsAddEmployeeModalOpen(true)}
          className="px-4 py-2 bg-green-500 text-white font-bold rounded shadow-lg hover:bg-green-600 transition"
        >
          Add Employee
        </button>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl p-8 mt-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Employees
        </h1>

        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search for employees..."
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <ul className="space-y-4">
          {currentEmployees.map((employee) => (
            <li
              key={employee.employee_id}
              className="p-5 bg-gradient-to-r from-gray-400 to-gray-200 text-white rounded-lg shadow-md flex flex-col md:flex-row md:items-center justify-between"
            >
              <div>
                <p className="text-lg font-semibold">
                  {employee.first_name} {employee.last_name}
                </p>
                <p className="text-base">Email: {employee.email}</p>
                <p className="text-base">Title: {employee.title || "N/A"}</p>
                <p className="text-base">Phone: {employee.phone || "N/A"}</p>
                <p className="text-base">
                  Country: {employee.country || "N/A"}
                </p>
                <p className="text-base">
                  Address: {employee.address || "N/A"}
                </p>
              </div>
              <div className="flex space-x-4 mt-2 md:mt-0">
                <button
                  onClick={() => {
                    setCurrentEmployee(employee);
                    setIsEditEmployeeModalOpen(true);
                  }}
                  className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleRemoveEmployee(employee.employee_id)}
                  className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex justify-center mt-6">
          {Array.from({
            length: Math.ceil(filteredEmployees.length / employeesPerPage),
          }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-1 mx-1 rounded ${
                currentPage === index + 1
                  ? "bg-purple-500 text-white"
                  : "bg-gray-300 text-gray-700"
              } hover:bg-purple-400 hover:text-white`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {isAddEmployeeModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Add Employee</h2>
            <input
              type="text"
              value={newEmployeeData.firstName}
              onChange={(e) =>
                setNewEmployeeData({
                  ...newEmployeeData,
                  firstName: e.target.value,
                })
              }
              placeholder="First Name"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <input
              type="text"
              value={newEmployeeData.lastName}
              onChange={(e) =>
                setNewEmployeeData({
                  ...newEmployeeData,
                  lastName: e.target.value,
                })
              }
              placeholder="Last Name"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <input
              type="email"
              value={newEmployeeData.email}
              onChange={(e) =>
                setNewEmployeeData({
                  ...newEmployeeData,
                  email: e.target.value,
                })
              }
              placeholder="Email"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <input
              type="text"
              value={newEmployeeData.title}
              onChange={(e) =>
                setNewEmployeeData({
                  ...newEmployeeData,
                  title: e.target.value,
                })
              }
              placeholder="Title"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <input
              type="text"
              value={newEmployeeData.phone}
              onChange={(e) =>
                setNewEmployeeData({
                  ...newEmployeeData,
                  phone: e.target.value,
                })
              }
              placeholder="Phone"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <input
              type="text"
              value={newEmployeeData.country}
              onChange={(e) =>
                setNewEmployeeData({
                  ...newEmployeeData,
                  country: e.target.value,
                })
              }
              placeholder="Country"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <input
              type="text"
              value={newEmployeeData.address}
              onChange={(e) =>
                setNewEmployeeData({
                  ...newEmployeeData,
                  address: e.target.value,
                })
              }
              placeholder="Address"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsAddEmployeeModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEmployee}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditEmployeeModalOpen && currentEmployee && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Edit Employee</h2>
            <input
              type="text"
              value={currentEmployee.first_name}
              onChange={(e) =>
                setCurrentEmployee({
                  ...currentEmployee,
                  first_name: e.target.value,
                })
              }
              placeholder="First Name"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <input
              type="text"
              value={currentEmployee.last_name}
              onChange={(e) =>
                setCurrentEmployee({
                  ...currentEmployee,
                  last_name: e.target.value,
                })
              }
              placeholder="Last Name"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <input
              type="email"
              value={currentEmployee.email}
              onChange={(e) =>
                setCurrentEmployee({
                  ...currentEmployee,
                  email: e.target.value,
                })
              }
              placeholder="Email"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <input
              type="text"
              value={currentEmployee.title || ""}
              onChange={(e) =>
                setCurrentEmployee({
                  ...currentEmployee,
                  title: e.target.value,
                })
              }
              placeholder="Title"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <input
              type="text"
              value={currentEmployee.phone || ""}
              onChange={(e) =>
                setCurrentEmployee({
                  ...currentEmployee,
                  phone: e.target.value,
                })
              }
              placeholder="Phone"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <input
              type="text"
              value={currentEmployee.country || ""}
              onChange={(e) =>
                setCurrentEmployee({
                  ...currentEmployee,
                  country: e.target.value,
                })
              }
              placeholder="Country"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <input
              type="text"
              value={currentEmployee.address || ""}
              onChange={(e) =>
                setCurrentEmployee({
                  ...currentEmployee,
                  address: e.target.value,
                })
              }
              placeholder="Address"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsEditEmployeeModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditEmployee}
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

export default AdminEmployeesPage;
