import { useDispatch, useSelector } from "react-redux";
import FoodItemCart from "./FoodItemCart";
import { useState, useRef, useEffect } from "react";
import { clearCart } from "../utils/cartSlice";

const GST_RATE = 0.05;
const DELIVERY_CHARGE = 40;

const Cart = () => {
  const cartItems = useSelector((store) => store.cart.items);
  const dispatch = useDispatch();

  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState("Select Address");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({});
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null); // State for selected address index

  const totalAmount = useRef(0);
  const [tax, setTax] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    calculateTotals();
  }, [cartItems]);

  const handleClearCart = () => dispatch(clearCart());

  const handleLocationChange = (location) => {
    setCurrentLocation(location);
    setShowLocationModal(false);
  };

  const calculateTotals = () => {
    totalAmount.current = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const calculatedTax = totalAmount.current * GST_RATE;
    setTax(calculatedTax);
    setGrandTotal(totalAmount.current + calculatedTax + DELIVERY_CHARGE);
  };

  const handleAddressFormSubmit = (e) => {
    e.preventDefault();
    setLocations([...locations, newAddress]);
    setCurrentLocation(newAddress.addressLine1);
    setShowAddAddressForm(false);
    setShowLocationModal(false);
    setNewAddress({});
  };

  const handleInputChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleAddressSelect = (index) => {
    setSelectedAddressIndex(index);
    setCurrentLocation(locations[index].addressLine1);
    setShowLocationModal(!showLocationModal);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl p-4 mx-auto bg-white rounded-md shadow-md sm:p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold sm:text-xl md:text-2xl">
            Cart Items - {cartItems.length}
          </h1>
          <button
            className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
            onClick={handleClearCart}
          >
            Clear Cart
          </button>
        </div>

        {/* Address Section */}
        <div className="flex items-center justify-between mb-6">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowLocationModal(true)}
          >
            <span className="text-sm font-semibold text-gray-700">
              {currentLocation}
            </span>
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>

        {/* Cart Items and Summary */}
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <h2 className="text-lg font-semibold text-gray-600">
              Your Cart is Empty 🛒
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Add items to the cart to see them here.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <FoodItemCart key={item.id} item={item} />
              ))}
            </div>

            <div className="p-4 mt-6 border-t sm:p-6">
              <div className="flex items-center justify-between">
                <span>Subtotal:</span>
                <span>&#8377; {(totalAmount.current / 100).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>GST (5%):</span>
                <span>&#8377; {(tax / 100).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery Charge:</span>
                <span>&#8377; {(DELIVERY_CHARGE / 100).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between mt-4 text-lg font-semibold">
                <span>Grand Total:</span>
                <span>&#8377; {(grandTotal / 100).toFixed(2)}</span>
              </div>
              <button
                className="w-full py-2 mt-4 text-sm font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                onClick={() => console.log("Proceeding to Checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}

        {/* Location Modal */}
        {showLocationModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
            <div className="w-full max-w-md p-6 transition-transform transform scale-100 bg-white rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Select or Add Address
                </h2>
                <button
                  className="text-gray-500 transition duration-150 hover:text-red-500"
                  onClick={() => setShowLocationModal(false)}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>

              <button
                className="w-full py-3 mb-4 text-sm text-white transition duration-150 bg-green-600 rounded-md hover:bg-green-700"
                onClick={() => setShowAddAddressForm(true)}
              >
                Add New Address
              </button>

              <div className="overflow-y-auto max-h-60">
                {locations.map((address, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 mb-4 transition duration-150 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    <input
                      type="radio" // Radio button for single select
                      checked={selectedAddressIndex === index}
                      onChange={() => handleAddressSelect(index)}
                      className="w-4 h-4 mr-3 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {address.fullName}
                      </p>
                      <p className="text-gray-600">{address.mobile}</p>
                      <p className="text-gray-600">
                        {address.addressLine1}, {address.city},{" "}
                        {address.pinCode}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Address Form */}
        {showAddAddressForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <form
              className="w-full max-w-md p-6 bg-white rounded-md"
              onSubmit={handleAddressFormSubmit}
            >
              <h2 className="mb-4 text-lg font-semibold">Add New Address</h2>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className="w-full p-2 mb-2 border rounded-md"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="mobile"
                placeholder="Mobile Number"
                className="w-full p-2 mb-2 border rounded-md"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="addressLine1"
                placeholder="Address Line 1"
                className="w-full p-2 mb-2 border rounded-md"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                className="w-full p-2 mb-2 border rounded-md"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="pinCode"
                placeholder="Pin Code"
                className="w-full p-2 mb-2 border rounded-md"
                onChange={handleInputChange}
              />
              <button className="w-full py-2 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                Save Address
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
