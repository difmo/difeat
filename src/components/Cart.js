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
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);

  const totalAmount = useRef(0);
  const [tax, setTax] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  useEffect(() => {
    calculateTotals();
  }, [cartItems]);

  useEffect(() => {
    // Load Razorpay script dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setIsRazorpayLoaded(true);
    script.onerror = () => console.error("Failed to load Razorpay script");
    document.body.appendChild(script);
  }, []);

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

  const handleCheckout = () => {
    if (!isRazorpayLoaded) {
      alert("Payment SDK not loaded. Please try again later.");
      return;
    }

    const options = {
      key: "rzp_test_5JTg9I35AkiZMQ", // Replace with your Razorpay key
      amount:(grandTotal), // Convert to smallest currency unit
      currency: "INR",
      name: "DifEat Services",
      description: "Order Payment",
      image: "https://example.com/logo.png", // Replace with your logo URL
      handler: function (response) {
        alert(`Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: "Dinesh kumar", // Use dynamic customer data if available
        email: "dinesh@gmail.com",
        contact: "8853389395",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new window.Razorpay(options); // Use window.Razorpay
    rzp1.open();
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
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
