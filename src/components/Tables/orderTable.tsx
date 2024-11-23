import { Package } from '@/types/package';
import Image from 'next/image';
import { Product } from '@/types/product';
import { useEffect, useState } from 'react';
import Modal from '../modals/Modal';
import FormElements from '../FormElements';
import { baseUrl } from '@/utils/constant';
import { useAuth } from '@/app/context/useAuth';
import { toast } from 'react-toastify';

const OrderTable = () => {
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

  const initialFormData = {
    user: '64ab4fcfa9f1d2b3c74f0a3b', // MongoDB ObjectId reference to a user
    cart: [
      {
        productId: '64b01e1fbbd7c1f5d10f8302', // MongoDB ObjectId reference to a product
        quantity: 2,
        price: 150.0,
      },
      {
        productId: '64b01e1fbbd7c1f5d10f8303', // MongoDB ObjectId reference to a product
        quantity: 1,
        price: 99.99,
      },
    ],
    name: 'John Doe', // Required field (customer's name)
    address: '123 Main Street, Apt 4B', // Required field (shipping address)
    email: 'johndoe@example.com', // Required field (customer's email)
    contact: '+1234567890', // Required field (customer's contact number)
    city: 'New York', // Required field (city)
    country: 'USA', // Required field (country)
    zipCode: '10001', // Required field (postal code)
    subTotal: 399.99, // Required field (subtotal before shipping and discounts)
    shippingCost: 15.0, // Optional field (shipping cost)
    discount: 10.0, // Optional field (discount applied)
    totalAmount: 404.99, // Required field (total after shipping and discount)
    shippingOption: 'Express', // Optional field (shipping method, e.g., 'Standard', 'Express')
    cardInfo: {
      cardNumber: '4111111111111111', // Required field (card number)
      expiryDate: '12/25', // Required field (card expiry date)
      cvv: '123', // Required field (card CVV)
    },
    paymentIntent: {
      id: 'pi_1234567890', // Required field (payment intent ID)
      status: 'succeeded', // Required field (payment status)
    },
    paymentMethod: 'credit_card', // Optional field (payment method, could be 'paypal', 'bank_transfer', etc.)
    orderNote: 'Please deliver between 9 AM and 5 PM.', // Optional field (any special note)
    status: 'pending', // Required field (order status: 'pending', 'processing', 'delivered', 'cancel')
  };

  // Then use it in useState
  const [formData, setFormData] = useState(initialFormData);

  // Fetch data from API
  const fetchData = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/order/orders`); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      setData(data.data); // Update state with fetched data
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
      const response = await fetch(
        `${baseUrl}/api/order/update-status/${formDataId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      // Handle success (e.g., notify the user, close the modal, etc.)
      console.log('Update successful:', result);
      toast.success('item updated successfully!');
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
      const response = await fetch(`${baseUrl}/api/order/saveOrder`, {
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
      toast.success('item added successfully!');
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
        `${baseUrl}/api/order/delete-order/${formDataId}`,
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
      toast.success('item deleted successfully!');
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
          {/* User Information */}
          <div>
            <label
              htmlFor="user"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              User ID:
            </label>
            <input
              type="text"
              id="user"
              name="user"
              value={initialFormData.user} // Directly using the user ID from initialFormData
              onChange={(e) =>
                setFormData({ ...formData, user: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Cart Items */}
          <div>
            <label
              htmlFor="cart"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Cart Items:
            </label>
            <textarea
              id="cart"
              name="cart"
              value={JSON.stringify(initialFormData.cart, null, 2)} // Displaying cart items as a string
              onChange={(e) =>
                setFormData({ ...formData, cart: JSON.parse(e.target.value) })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Customer Name */}
          <div>
            <label
              htmlFor="name"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Customer Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={initialFormData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Shipping Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={initialFormData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={initialFormData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Contact */}
          <div>
            <label
              htmlFor="contact"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Contact Number:
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={initialFormData.contact}
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              City:
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={initialFormData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="country"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Country:
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={initialFormData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Zip Code */}
          <div>
            <label
              htmlFor="zipCode"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Zip Code:
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={initialFormData.zipCode}
              onChange={(e) =>
                setFormData({ ...formData, zipCode: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Subtotal */}
          <div>
            <label
              htmlFor="subTotal"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Subtotal:
            </label>
            <input
              type="number"
              id="subTotal"
              name="subTotal"
              value={initialFormData.subTotal}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subTotal: parseFloat(e.target.value),
                })
              }
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Shipping Cost */}
          <div>
            <label
              htmlFor="shippingCost"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Shipping Cost:
            </label>
            <input
              type="number"
              id="shippingCost"
              name="shippingCost"
              value={initialFormData.shippingCost}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  shippingCost: parseFloat(e.target.value),
                })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Discount */}
          <div>
            <label
              htmlFor="discount"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Discount:
            </label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={initialFormData.discount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  discount: parseFloat(e.target.value),
                })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Total Amount */}
          <div>
            <label
              htmlFor="totalAmount"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Total Amount:
            </label>
            <input
              type="number"
              id="totalAmount"
              name="totalAmount"
              value={initialFormData.totalAmount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalAmount: parseFloat(e.target.value),
                })
              }
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Shipping Option */}
          <div>
            <label
              htmlFor="shippingOption"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Shipping Option:
            </label>
            <input
              type="text"
              id="shippingOption"
              name="shippingOption"
              value={initialFormData.shippingOption}
              onChange={(e) =>
                setFormData({ ...formData, shippingOption: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Order Status */}
          <div>
            <label
              htmlFor="status"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Order Status:
            </label>
            <select
              id="status"
              name="status"
              value={initialFormData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="cancel">Cancel</option>
            </select>
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
          {/* User Information */}
          <div>
            <label
              htmlFor="user"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              User ID:
            </label>
            <input
              type="text"
              id="user"
              name="user"
              value={initialFormData.user} // Directly using the user ID from initialFormData
              onChange={(e) =>
                setFormData({ ...formData, user: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Cart Items */}
          <div>
            <label
              htmlFor="cart"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Cart Items:
            </label>
            <textarea
              id="cart"
              name="cart"
              value={JSON.stringify(initialFormData.cart, null, 2)} // Displaying cart items as a string
              onChange={(e) =>
                setFormData({ ...formData, cart: JSON.parse(e.target.value) })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Customer Name */}
          <div>
            <label
              htmlFor="name"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Customer Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={initialFormData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Shipping Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={initialFormData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={initialFormData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Contact */}
          <div>
            <label
              htmlFor="contact"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Contact Number:
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={initialFormData.contact}
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              City:
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={initialFormData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="country"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Country:
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={initialFormData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Zip Code */}
          <div>
            <label
              htmlFor="zipCode"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Zip Code:
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={initialFormData.zipCode}
              onChange={(e) =>
                setFormData({ ...formData, zipCode: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Subtotal */}
          <div>
            <label
              htmlFor="subTotal"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Subtotal:
            </label>
            <input
              type="number"
              id="subTotal"
              name="subTotal"
              value={initialFormData.subTotal}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subTotal: parseFloat(e.target.value),
                })
              }
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Shipping Cost */}
          <div>
            <label
              htmlFor="shippingCost"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Shipping Cost:
            </label>
            <input
              type="number"
              id="shippingCost"
              name="shippingCost"
              value={initialFormData.shippingCost}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  shippingCost: parseFloat(e.target.value),
                })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Discount */}
          <div>
            <label
              htmlFor="discount"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Discount:
            </label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={initialFormData.discount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  discount: parseFloat(e.target.value),
                })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Total Amount */}
          <div>
            <label
              htmlFor="totalAmount"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Total Amount:
            </label>
            <input
              type="number"
              id="totalAmount"
              name="totalAmount"
              value={initialFormData.totalAmount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalAmount: parseFloat(e.target.value),
                })
              }
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Shipping Option */}
          <div>
            <label
              htmlFor="shippingOption"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Shipping Option:
            </label>
            <input
              type="text"
              id="shippingOption"
              name="shippingOption"
              value={initialFormData.shippingOption}
              onChange={(e) =>
                setFormData({ ...formData, shippingOption: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Order Status */}
          <div>
            <label
              htmlFor="status"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Order Status:
            </label>
            <select
              id="status"
              name="status"
              value={initialFormData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="cancel">Cancel</option>
            </select>
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
          {/* User Information */}
          <div>
            <label
              htmlFor="user"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              User ID:
            </label>
            <input
              type="text"
              id="user"
              name="user"
              disabled
              value={initialFormData.user} // Directly using the user ID from initialFormData
              onChange={(e) =>
                setFormData({ ...formData, user: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Cart Items */}
          <div>
            <label
              htmlFor="cart"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Cart Items:
            </label>
            <textarea
              id="cart"
              name="cart"
              disabled
              value={JSON.stringify(initialFormData.cart, null, 2)} // Displaying cart items as a string
              onChange={(e) =>
                setFormData({ ...formData, cart: JSON.parse(e.target.value) })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Customer Name */}
          <div>
            <label
              htmlFor="name"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Customer Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              disabled
              value={initialFormData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Shipping Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              disabled
              value={initialFormData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              disabled
              value={initialFormData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Contact */}
          <div>
            <label
              htmlFor="contact"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Contact Number:
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              disabled
              value={initialFormData.contact}
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              City:
            </label>
            <input
              type="text"
              id="city"
              name="city"
              disabled
              value={initialFormData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="country"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Country:
            </label>
            <input
              type="text"
              id="country"
              name="country"
              disabled
              value={initialFormData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Zip Code */}
          <div>
            <label
              htmlFor="zipCode"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Zip Code:
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              disabled
              value={initialFormData.zipCode}
              onChange={(e) =>
                setFormData({ ...formData, zipCode: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Subtotal */}
          <div>
            <label
              htmlFor="subTotal"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Subtotal:
            </label>
            <input
              type="number"
              id="subTotal"
              name="subTotal"
              disabled
              value={initialFormData.subTotal}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subTotal: parseFloat(e.target.value),
                })
              }
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Shipping Cost */}
          <div>
            <label
              htmlFor="shippingCost"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Shipping Cost:
            </label>
            <input
              type="number"
              id="shippingCost"
              name="shippingCost"
              disabled
              value={initialFormData.shippingCost}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  shippingCost: parseFloat(e.target.value),
                })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Discount */}
          <div>
            <label
              htmlFor="discount"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Discount:
            </label>
            <input
              type="number"
              id="discount"
              name="discount"
              disabled
              value={initialFormData.discount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  discount: parseFloat(e.target.value),
                })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Total Amount */}
          <div>
            <label
              htmlFor="totalAmount"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Total Amount:
            </label>
            <input
              type="number"
              id="totalAmount"
              name="totalAmount"
              disabled
              value={initialFormData.totalAmount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalAmount: parseFloat(e.target.value),
                })
              }
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Shipping Option */}
          <div>
            <label
              htmlFor="shippingOption"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Shipping Option:
            </label>
            <input
              type="text"
              id="shippingOption"
              name="shippingOption"
              disabled
              value={initialFormData.shippingOption}
              onChange={(e) =>
                setFormData({ ...formData, shippingOption: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Order Status */}
          <div>
            <label
              htmlFor="status"
              className="block font-medium text-gray-700 dark:text-gray-300"
            >
              Order Status:
            </label>
            <select
              id="status"
              name="status"
              disabled
              value={initialFormData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="mt-1 w-full rounded border border-gray-300 p-2 text-black dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="cancel">Cancel</option>
            </select>
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
        <button
          onClick={() => {
            setIsAddOpen(true);
            setFormData(initialFormData);
          }}
          className="mr-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Add new item
        </button>
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
                Customer Name
              </th>
              <th className="min-w-[220px] px-4 py-4 font-medium text-dark dark:text-white xl:pl-7.5">
                Email Address
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">
                Shipping Address
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                Contact Number
              </th>
              <th className="px-4 py-4 text-right font-medium text-dark dark:text-white xl:pr-7.5">
                City / Country
              </th>
              <th className="px-4 py-4 text-right font-medium text-dark dark:text-white xl:pr-7.5">
                Total Amount
              </th>
              <th className="px-4 py-4 text-right font-medium text-dark dark:text-white xl:pr-7.5">
                Order Status
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
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3 xl:pl-7.5">
                    <p className="text-dark dark:text-white">
                      {packageItem?.name} {/* Displaying customer's name */}
                    </p>
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    <p className="text-dark dark:text-white">
                      {packageItem?.email} {/* Displaying customer's email */}
                    </p>
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    <p className="text-dark dark:text-white">
                      {packageItem?.address} {/* Displaying shipping address */}
                    </p>
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    <p className="text-dark dark:text-white">
                      {packageItem?.contact}{' '}
                      {/* Displaying customer's contact number */}
                    </p>
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    <p className="text-dark dark:text-white">
                      {packageItem?.city}, {packageItem?.country}{' '}
                      {/* Displaying city and country */}
                    </p>
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    <p className="text-dark dark:text-white">
                      ${packageItem?.totalAmount}{' '}
                      {/* Displaying total amount */}
                    </p>
                  </td>
                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3">
                    <p className="text-dark dark:text-white">
                      {packageItem?.status} {/* Displaying order status */}
                    </p>
                  </td>

                  <td className="border-[#eee] px-4 py-4 dark:border-dark-3 xl:pr-7.5">
                    <div className="flex items-center justify-end space-x-3.5">
                      <button
                        className="hover:text-primary"
                        onClick={() => handleEdit(packageItem._id)}
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
                            d="M15.5 0.5C15.9 0.5 16.3 0.6 16.7 1C17.1 1.4 17.3 1.8 17.5 2.3C17.8 2.7 17.9 3.2 17.8 3.7C17.6 4.1 17.3 4.5 16.8 5L14.5 7.3L12.7 5.5L14.5 3.7L15.5 2.7C15.8 2.4 16 2.2 16.3 2.1C16.7 2.1 17 2.3 17.3 2.7C17.6 3 17.8 3.4 17.9 3.8C18 4.3 17.9 4.8 17.7 5.2C17.4 5.6 17.1 6 16.7 6.4L13.3 9.8L10.1 6.6L7.5 9.2L0.7 16L0 20L4 19.3L10.8 13.5L13 15.7L16.5 12.2L18.8 14.5C19.1 14.8 19.4 15.1 19.5 15.6C19.6 16 19.5 16.5 19.3 17C19.1 17.5 18.7 17.9 18.3 18.1C17.8 18.3 17.3 18.2 16.8 18C16.4 17.9 16 17.7 15.5 17.5L15.5 17.5L12.1 14.1L15.5 10.8L18.3 13.7C18.5 14 18.5 14.4 18.5 14.8C18.5 15.2 18.5 15.6 18.4 16C18.2 16.5 18 16.9 17.5 17.4C17 17.9 16.5 18.2 16 18.3C15.5 18.4 15 18.3 14.5 18C14 17.8 13.6 17.5 13.3 17L15.5 15.5L17.1 13.9C17.1 13.9 16.5 14.2 16 14.6C15.5 15 15.2 15.4 15 15.9C14.9 16.4 14.9 16.9 15.1 17.3C15.3 17.8 15.6 18.3 15.5 18.8C15.5 19.3 15.2 19.8 14.7 20C14.2 20.2 13.6 20.1 13 19.8C12.4 19.5 12 19 11.7 18.6L10.5 17.4L9.3 16.2L11.5 14L9.2 11.7L11.3 9.6L13.5 11.8L15.5 9.8C16.1 9.2 16.5 8.3 16.4 7.5C16.3 6.7 16 6 15.5 5.5L16.4 4.6L15.5 3.7L14.5 2.7L12.5 4.7L10.5 2.7L8.5 4.7L6.5 2.7L4.5 4.7L2.5 2.7L0.5 4.7L2.5 6.7L0.5 8.7L0 8.7L0 7.5L2.5 5L5 7.5L7.5 5L10 7.5L12.5 5L15.5 2.5L16.5 1.5L15.5 0.5H15.5Z"
                            fill=""
                          />
                        </svg>
                      </button>
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
                      <button
                        className="hover:text-primary"
                        onClick={() => handleView(packageItem._id)}
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
                            d="M9.99935 6.87492C8.27346 6.87492 6.87435 8.27403 6.87435 9.99992C6.87435 11.7258 8.27346 13.1249 9.99935 13.1249C11.7252 13.1249 13.1243 11.7258 13.1243 9.99992C13.1243 8.27403 11.7252 6.87492 9.99935 6.87492ZM8.12435 9.99992C8.12435 8.96438 8.96382 8.12492 9.99935 8.12492C11.0349 8.12492 11.8743 8.96438 11.8743 9.99992C11.8743 11.0355 11.0349 11.8749 9.99935 11.8749C8.96382 11.8749 8.12435 11.0355 8.12435 9.99992Z"
                            fill=""
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.99935 2.70825C6.23757 2.70825 3.70376 4.96175 2.23315 6.8723L2.20663 6.90675C1.87405 7.3387 1.56773 7.73652 1.35992 8.20692C1.13739 8.71064 1.04102 9.25966 1.04102 9.99992C1.04102 10.7402 1.13739 11.2892 1.35992 11.7929C1.56773 12.2633 1.87405 12.6611 2.20664 13.0931L2.23316 13.1275C3.70376 15.0381 6.23757 17.2916 9.99935 17.2916C13.7611 17.2916 16.2949 15.0381 17.7655 13.1275L17.792 13.0931C18.1246 12.6612 18.431 12.2633 18.6388 11.7929C18.8613 11.2892 18.9577 10.7402 18.9577 9.99992C18.9577 9.25966 18.8613 8.71064 18.6388 8.20692C18.431 7.73651 18.1246 7.33868 17.792 6.90673L17.7655 6.8723C16.2949 4.96175 13.7611 2.70825 9.99935 2.70825ZM3.2237 7.63475C4.58155 5.87068 6.79132 3.95825 9.99935 3.95825C13.2074 3.95825 15.4172 5.87068 16.775 7.63475C17.1405 8.10958 17.3546 8.3933 17.4954 8.71204C17.627 9.00993 17.7077 9.37403 17.7077 9.99992C17.7077 10.6258 17.627 10.9899 17.4954 11.2878C17.3546 11.6065 17.1405 11.8903 16.775 12.3651C15.4172 14.1292 13.2074 16.0416 9.99935 16.0416C6.79132 16.0416 4.58155 14.1292 3.2237 12.3651C2.85821 11.8903 2.64413 11.6065 2.50332 11.2878C2.37171 10.9899 2.29102 10.6258 2.29102 9.99992C2.29102 9.37403 2.37171 9.00993 2.50332 8.71204C2.64413 8.3933 2.85821 8.10958 3.2237 7.63475Z"
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

export default OrderTable;
