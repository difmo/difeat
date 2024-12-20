import { useDispatch, useSelector } from "react-redux";
import FoodItemCart from "./FoodItemCart";
import { useState, useRef, useEffect } from "react";
import { clearCart } from "../utils/cartSlice";
import {
  auth, firestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs
} from "../../firebase";
import { FaHome, FaBriefcase, FaBuilding, FaTrashAlt, FaEdit, FaPlusCircle } from "react-icons/fa";
const GST_RATE = 0.05;
const DELIVERY_CHARGE = 40;

const Cart = () => {
  const [addresses, setAddresses] = useState([]);
  const [currentLocation, setCurrentLocation] = useState("Select Address");
  const [showLocationModal, setShowLocationModal] = useState(false);

  const cartItems = useSelector((store) => store.cart.items);
console.log(cartItems, "cartItems");
  const storeId = useSelector((store) => store.cart.items[0]?.storeId);
  const dispatch = useDispatch();

  console.log('sdfjj', storeId);

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

  const calculateTotals = () => {
    console.log('cartItems : ',cartItems);
    totalAmount.current = cartItems.reduce((total, item) => {
      const price = Number(item.price);
      const quantity = Number(item.quantity);

      // Ensure price and quantity are valid numbers
      if (isNaN(price) || isNaN(quantity)) {
        console.error(`Invalid price or quantity for item: ${item.id}`);
        return total; // Skip this item if invalid
      }

      return total + price * quantity;
    }, 0);

    // If totalAmount is still NaN, reset to 0
    if (isNaN(totalAmount.current)) {
      totalAmount.current = 0;
    }

    const calculatedTax = totalAmount.current * GST_RATE;
    setTax(calculatedTax);
    setGrandTotal(totalAmount.current + calculatedTax + DELIVERY_CHARGE);
  };

  const handleCheckout = async () => {
    const createdBy = auth ? auth.currentUser.uid : null;
    console.log(createdBy);
    console.log(storeId);
    console.log(grandTotal);
    console.log(totalAmount);

    if (!isRazorpayLoaded) {
      alert("Payment SDK not loaded. Please try again later.");
      return;
    }

    const options = {
      key: "rzp_test_5JTg9I35AkiZMQ", 
      amount: grandTotal * 100, 
      currency: "INR",
      name: "DifEat Services",
      description: "Order Payment",
      image: "https://example.com/logo.png", 
      handler: async function (response) {
        const orderDate = new Date();
        const deliveryDate = new Date();
        deliveryDate.setDate(orderDate.getDate() + 1); 
        const orderData = {
          userId: createdBy,
          storeId: storeId,
          products: cartItems,
          totalPrice: grandTotal,
          status: "pending",
          createdAt: new Date().toISOString(),
          location: currentLocation,
          orderId: response.razorpay_payment_id,
          orderDate: orderDate,           
          deliveryDate: deliveryDate,   
        };
        console.log(orderData);
        // try {
          const ordersCollectionRef = collection(firestore, "orders");
          await addDoc(ordersCollectionRef, orderData);
          handleClearCart();
          alert("Your order has been placed successfully!");
        // } catch (error) {
        //   console.error("Error saving order to Firestore: ", error);
        //   alert("There was an issue placing your order. Please try again.");
        // }
      },
      prefill: {
        name: "Dinesh kumar", 
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

  const handleLocationChange = (address) => {
    setCurrentLocation(`${address.line1},${address.city},${address.zipCode}`);
    setShowLocationModal(false);
    setPrimaryAddress(auth.currentUser.uid, address);
  };

  const setPrimaryAddress = async (userId, selectedAddress) => {
    const userDocRef = doc(firestore, "difeatusers", userId);
    try {
      await updateDoc(userDocRef, {
        primaryAddress: {
          line1: selectedAddress.line1,
          city: selectedAddress.city,
          zipCode: selectedAddress.zipCode,
          label: selectedAddress.label,  // e.g., Home, Work
        },
      });
      console.log("Primary address updated successfully.");
    } catch (error) {
      console.error("Error updating primary address: ", error);
    }
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

        {/* Address Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Delivery Address:</label>
          <button
            className="w-full px-4 py-2 text-left border rounded-md text-gray-600 bg-gray-50 hover:bg-gray-100"
            onClick={() => setShowLocationModal(true)}
          >
            {currentLocation}
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
                <span>&#8377; {totalAmount.current.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>GST (5%):</span>
                <span>&#8377; {tax.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery Charge:</span>
                <span>&#8377; {DELIVERY_CHARGE.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between mt-4 text-lg font-semibold">
                <span>Grand Total:</span>
                <span>&#8377; {grandTotal.toFixed(2)}</span>
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
        {/* Location Modal */}
        {showLocationModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-11/12 max-w-md p-4 bg-white rounded-md shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Select Delivery Address</h3>
              <ul>
                {addresses.map((address) => (
                  <li
                    key={address.id}
                    className="px-4 py-2 mb-2 border rounded-md cursor-pointer hover:bg-gray-100"
                    onClick={() => handleLocationChange(address)}
                  >
                    {address.line1}, {address.city}, {address.zipCode}
                  </li>
                ))}
              </ul>
              <button
                className="w-full mt-4 px-4 py-2 text-white bg-gray-700 rounded-md hover:bg-gray-800"
                onClick={() => setShowLocationModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
