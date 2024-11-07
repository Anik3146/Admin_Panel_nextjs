import { Package } from '@/types/package';
import Image from 'next/image';
import { Product } from '@/types/product';
import { useEffect, useState } from 'react';
import Modal from '../modals/Modal';
import FormElements from '../FormElements';
import { baseUrl } from '@/utils/constant';
import { useAuth } from '@/app/context/useAuth';

const UserTable = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [data, setData] = useState<any>([]);
  const [formDataId, setFormDataId] = useState<any>();
  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  // Define initialFormData first
  const initialFormData = {
    logo: 'https://www.chanel.com/images/q_auto:good,f_auto,fl_lossy,dpr_1.1/w_386/FSH-1711464573035-m05.jpg', // Optional field (brand logo URL)
    name: 'SuperTech', // Required field (brand name, unique)
    description: 'A leading brand in tech products.', // Optional field (description of the brand)
    email: 'contact@supertech.com', // Optional field (valid email address)
    website: 'https://www.supertech.com', // Optional field (brand website URL)
    location: 'New York, USA', // Optional field (location of the brand)
    status: 'active', // Enum values: 'active' | 'inactive' (default is 'active')
  };

  // Then use it in useState
  const [formData, setFormData] = useState(initialFormData);

  // Fetch data from API
  const fetchData = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/user/all`, {
        method: 'GET', // HTTP method (GET is default, but added here for clarity)
        headers: {
          'Content-Type': 'application/json', // Standard header for JSON response
          Authorization: `Bearer ${user?.token}`, // Add authorization token if needed
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      setData(data); // Update state with fetched data
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const handleSortChange = (e: any) => {
    setSortBy(e.target.value);
    if (e.target.value === 'custom') {
      setIsCustomDate(true);
    } else {
      setIsCustomDate(false);
    }
  };

  const handleEdit = (id: any) => {
    // Assuming you have a data array from which you want to find the package
    setFormDataId(id);
    const updatedPackage = data.find((item: any) => item._id === id);

    if (updatedPackage) {
      // Set the found package details in formData or similar state
      setFormData(updatedPackage);
      setIsEditOpen(true);
    } else {
      console.error('Package not found');
    }
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault(); // Prevent default form submission

    // Log the formData to check if it has been updated
    console.log('Form Data before update:', formData);

    try {
      const response = await fetch(`${baseUrl}/api/brand/edit/${formDataId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      // Handle success (e.g., notify the user, close the modal, etc.)
      console.log('Update successful:', result);
      setIsEditOpen(false); // Close the modal or take another action
      fetchData();
    } catch (error) {
      console.error('Error updating the data:', error);
    }
  };

  const handleView = (id: any) => {
    // Assuming you have a data array from which you want to find the package

    const updatedPackage = data.find((item: any) => item._id === id);

    if (updatedPackage) {
      // Set the found package details in formData or similar state
      setFormData(updatedPackage);
      setIsViewOpen(true);
    } else {
      console.error('Package not found');
    }
  };

  const handleAdd = async (event: any) => {
    event.preventDefault(); // Prevent the default form submission

    // Prepare the payload with the arrays directly
    const formDataWithArrays = {
      ...formData, // This already contains the arrays for tags and sizes
    };

    try {
      // Make the API call with formDataWithArrays as the payload
      const response = await fetch(`${baseUrl}/api/brand/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(formDataWithArrays),
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const data = await response.json();
      console.log('Product added:', data);

      setIsAddOpen(false); // Close the add dialog
      fetchData();
    } catch (error) {
      console.error('Error adding product:', error);
      // Handle error state (e.g., show a notification)
    }
  };

  const handleDelete = (id: any) => {
    setFormDataId(id);
    setIsDeleteOpen(true);
  };

  // Function to confirm deletion
  const confirmDelete = async () => {
    // Assume formDataId is the ID of the item you want to delete
    try {
      const response = await fetch(
        `${baseUrl}/api/user/delete-user/${formDataId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      // Handle success (e.g., notify the user, update the UI, etc.)
      console.log('Delete successful:', result);
      fetchData();
      // Optionally refresh the data or update state to remove the deleted item
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error('Error deleting the data:', error);
    }
    fetchData();
    setIsDeleteOpen(false); // Close the delete confirmation modal
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    console.log(formData);
  }, [formData]);
  useEffect(() => {
    console.log(formDataId);
  }, [formDataId]);

  useEffect(() => {
    let filtered = [...data];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filter
    if (fromDate) {
      filtered = filtered.filter(
        (item) => new Date(item?.createdAt) >= new Date(fromDate)
      );
    }
    if (toDate) {
      filtered = filtered.filter(
        (item) => new Date(item?.createdAt) <= new Date(toDate)
      );
    }

    // Sort
    if (sortBy === 'ascending') {
      filtered.sort((a, b) => {
        const startDateA = new Date(a.createdAt || 0); // Use 0 for invalid dates
        const startDateB = new Date(b.createdAt || 0); // Use 0 for invalid dates
        return startDateA.getTime() - startDateB.getTime();
      });
    } else if (sortBy === 'descending') {
      filtered.sort((a, b) => {
        const startDateA = new Date(a.createdAt || 0); // Use 0 for invalid dates
        const startDateB = new Date(b.createdAt || 0); // Use 0 for invalid dates
        return startDateB.getTime() - startDateA.getTime();
      });
    }

    setFilteredData(filtered);
  }, [data, searchTerm, sortBy, fromDate, toDate]);

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      {/* Modal for Adding */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Package"
      >
        <form
          onSubmit={handleAdd}
          className="grid grid-cols-1 gap-4 bg-white p-4 dark:bg-gray-800"
        >
          {/* Brand Logo URL */}
          <div>
            <label
              htmlFor="logo"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Logo URL:
            </label>
            <input
              type="url"
              id="logo"
              name="logo"
              value={formData.logo}
              onChange={(e) =>
                setFormData({ ...formData, logo: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Brand Name */}
          <div>
            <label
              htmlFor="name"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Brand Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Brand Description */}
          <div>
            <label
              htmlFor="description"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Brand Email */}
          <div>
            <label
              htmlFor="email"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Brand Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Brand Website */}
          <div>
            <label
              htmlFor="website"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Website URL:
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Brand Location */}
          <div>
            <label
              htmlFor="location"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Location:
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Save
          </button>
        </form>
      </Modal>
      {/* Modal for Editing */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Package"
      >
        <form
          onSubmit={handleUpdate}
          className="grid grid-cols-1 gap-4 bg-white p-4 dark:bg-gray-800"
        >
          {/* Brand Logo URL */}
          <div>
            <label
              htmlFor="logo"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Logo URL:
            </label>
            <input
              type="url"
              id="logo"
              name="logo"
              value={formData.logo}
              onChange={(e) =>
                setFormData({ ...formData, logo: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Brand Name */}
          <div>
            <label
              htmlFor="name"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Brand Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Brand Description */}
          <div>
            <label
              htmlFor="description"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Brand Email */}
          <div>
            <label
              htmlFor="email"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Brand Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Brand Website */}
          <div>
            <label
              htmlFor="website"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Website URL:
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Brand Location */}
          <div>
            <label
              htmlFor="location"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Location:
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <button
            type="submit"
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Update
          </button>
        </form>
      </Modal>

      {/* Modal for Viewing */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="View Package"
      >
        <form
          onSubmit={handleView}
          className="grid grid-cols-1 gap-4 bg-white p-4 dark:bg-gray-800"
        >
          {/* Brand Logo URL */}
          <div>
            <label
              htmlFor="logo"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Logo URL:
            </label>
            <input
              type="url"
              id="logo"
              name="logo"
              value={formData.logo}
              onChange={(e) =>
                setFormData({ ...formData, logo: e.target.value })
              }
              disabled // Disable the input
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Brand Name */}
          <div>
            <label
              htmlFor="name"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Brand Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              disabled // Disable the input
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Brand Description */}
          <div>
            <label
              htmlFor="description"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled // Disable the textarea
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Brand Email */}
          <div>
            <label
              htmlFor="email"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Brand Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled // Disable the input
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Brand Website */}
          <div>
            <label
              htmlFor="website"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Website URL:
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              disabled // Disable the input
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Brand Location */}
          <div>
            <label
              htmlFor="location"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Location:
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              disabled // Disable the input
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </form>
      </Modal>
      {/* Modal for delete */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Deletion"
      >
        <p className="mb-4">Are you sure you want to delete this package?</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setIsDeleteOpen(false)}
            className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300"
          >
            No
          </button>
          <button
            onClick={confirmDelete}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 dark:bg-red-700"
          >
            Yes
          </button>
        </div>
      </Modal>

      {/* Controls above the table */}
      <div className="mb-4 flex items-center justify-between">
        <div className="ml-auto flex items-center space-x-2 text-gray-700">
          <input
            type="text"
            placeholder="🔍 Search..."
            value={searchTerm} // Add state for search term
            onChange={(e) => setSearchTerm(e.target.value)} // Update state on change
            className="rounded border border-gray-300 bg-gray-100 p-2"
          />
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="rounded border border-gray-300 bg-gray-100 p-2"
          >
            <option value="">Sort by Date</option>
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
            <option value="custom">Custom</option>
          </select>
          {isCustomDate && (
            <div className="flex space-x-2">
              <div className="mt-2 text-black dark:text-white">From</div>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="mx-1 rounded border border-gray-300 bg-gray-100 p-2"
              />
              <div className="mt-2 text-black dark:text-white">To</div>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="mx-1 rounded border border-gray-300 bg-gray-100 p-2"
              />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-[#F7F9FC] text-left dark:bg-dark-2">
              <th className="min-w-[220px] px-4 py-4 font-medium text-dark dark:text-white xl:pl-7.5">
                Name
              </th>
              <th className="min-w-[220px] px-4 py-4 font-medium text-dark dark:text-white xl:pl-7.5">
                Email
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                Role
              </th>
              <th className="px-4 py-4 text-right font-medium text-dark dark:text-white xl:pr-7.5">
                Status
              </th>
              <th className="px-4 py-4 text-right font-medium text-dark dark:text-white xl:pr-7.5">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredData &&
              filteredData.map((packageItem: any, index: any) => (
                <tr key={index}>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    <p className="text-dark dark:text-white">
                      {packageItem?.name}
                    </p>
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    <p className="text-dark dark:text-white">
                      {packageItem?.email}
                    </p>
                  </td>

                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    <p className="text-dark dark:text-white">
                      {packageItem?.role}
                    </p>
                  </td>

                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    <p className="text-dark dark:text-white">
                      {packageItem?.status}
                    </p>
                  </td>

                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3 xl:pr-7.5">
                    <div className="flex items-center justify-end space-x-3.5">
                      <button
                        className="hover:text-primary"
                        onClick={() => handleDelete(packageItem._id)}
                      >
                        <svg
                          className="fill-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M8.59048 1.87502H11.4084C11.5887 1.8749 11.7458 1.8748 11.8941 1.89849C12.4802 1.99208 12.9874 2.35762 13.2615 2.88403C13.3309 3.01727 13.3805 3.16634 13.4374 3.33745L13.5304 3.61654C13.5461 3.66378 13.5506 3.67715 13.5545 3.68768C13.7004 4.09111 14.0787 4.36383 14.5076 4.3747C14.5189 4.37498 14.5327 4.37503 14.5828 4.37503H17.0828C17.4279 4.37503 17.7078 4.65485 17.7078 5.00003C17.7078 5.34521 17.4279 5.62503 17.0828 5.62503H2.91602C2.57084 5.62503 2.29102 5.34521 2.29102 5.00003C2.29102 4.65485 2.57084 4.37503 2.91602 4.37503H5.41609C5.46612 4.37503 5.47993 4.37498 5.49121 4.3747C5.92009 4.36383 6.29844 4.09113 6.44437 3.6877C6.44821 3.67709 6.45262 3.66401 6.46844 3.61654L6.56145 3.33747C6.61836 3.16637 6.66795 3.01728 6.73734 2.88403C7.01146 2.35762 7.51862 1.99208 8.1047 1.89849C8.25305 1.8748 8.41016 1.8749 8.59048 1.87502ZM7.50614 4.37503C7.54907 4.29085 7.5871 4.20337 7.61983 4.1129C7.62977 4.08543 7.63951 4.05619 7.65203 4.01861L7.7352 3.7691C7.81118 3.54118 7.82867 3.49469 7.84602 3.46137C7.9374 3.2859 8.10645 3.16405 8.30181 3.13285C8.33892 3.12693 8.38854 3.12503 8.6288 3.12503H11.37C11.6103 3.12503 11.6599 3.12693 11.697 3.13285C11.8924 3.16405 12.0614 3.2859 12.1528 3.46137C12.1702 3.49469 12.1877 3.54117 12.2636 3.7691L12.3468 4.01846L12.379 4.11292C12.4117 4.20338 12.4498 4.29085 12.4927 4.37503H7.50614Z"
                            fill=""
                          />
                          <path
                            d="M4.92859 7.04179C4.90563 6.69738 4.60781 6.43679 4.2634 6.45975C3.91899 6.48271 3.6584 6.78053 3.68136 7.12494L4.06757 12.9181C4.13881 13.987 4.19636 14.8505 4.33134 15.528C4.47167 16.2324 4.71036 16.8208 5.20335 17.2821C5.69635 17.7433 6.2993 17.9423 7.01151 18.0355C7.69653 18.1251 8.56189 18.125 9.63318 18.125H10.3656C11.4369 18.125 12.3023 18.1251 12.9873 18.0355C13.6995 17.9423 14.3025 17.7433 14.7955 17.2821C15.2885 16.8208 15.5272 16.2324 15.6675 15.528C15.8025 14.8505 15.86 13.987 15.9313 12.9181L16.3175 7.12494C16.3404 6.78053 16.0798 6.48271 15.7354 6.45975C15.391 6.43679 15.0932 6.69738 15.0702 7.04179L14.687 12.7911C14.6121 13.9143 14.5587 14.6958 14.4416 15.2838C14.328 15.8542 14.1693 16.1561 13.9415 16.3692C13.7137 16.5824 13.4019 16.7206 12.8252 16.796C12.2307 16.8738 11.4474 16.875 10.3217 16.875H9.67718C8.55148 16.875 7.76814 16.8738 7.17364 16.796C6.59697 16.7206 6.28518 16.5824 6.05733 16.3692C5.82949 16.1561 5.67088 15.8542 5.55725 15.2838C5.44011 14.6958 5.38675 13.9143 5.31187 12.7911L4.92859 7.04179Z"
                            fill=""
                          />
                          <path
                            d="M7.8539 8.5448C8.19737 8.51045 8.50364 8.76104 8.53799 9.10451L8.95466 13.2712C8.989 13.6146 8.73841 13.9209 8.39495 13.9553C8.05148 13.9896 7.74521 13.739 7.71086 13.3956L7.29419 9.22889C7.25985 8.88542 7.51044 8.57915 7.8539 8.5448Z"
                            fill=""
                          />
                          <path
                            d="M12.1449 8.5448C12.4884 8.57915 12.739 8.88542 12.7047 9.22889L12.288 13.3956C12.2536 13.739 11.9474 13.9896 11.6039 13.9553C11.2604 13.9209 11.0098 13.6146 11.0442 13.2712L11.4609 9.10451C11.4952 8.76104 11.8015 8.51045 12.1449 8.5448Z"
                            fill=""
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
