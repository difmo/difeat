import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../utils/cartSlice";
import FoodItemCart from "./FoodItemCart";
import { useRef, useState } from "react";

const Cart = () => {
  const cartItems = useSelector((store) => store.cart.items);
  const dispatch = useDispatch();
  let totalAmount = useRef(0);
  const [location, setLocation] = useState("Lucknow, Uttar Pradesh");

  const handleCheckoutCart = () => {
    console.log("Proceeding to checkout...");
    alert(`Total Payment: ₹${(totalAmount.current / 100).toFixed(2)}`);
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  totalAmount.current = 0;
  const totalHandler = (price, quantity) => {
    totalAmount.current += price * quantity;
  };

  // Mock delivery charges, taxes, and discounts
  const deliveryFee = 3000; // 30.00 INR
  const tax = totalAmount.current * 0.05; // 5% GST
  const discount = 1000; // 10.00 INR discount

  const grandTotal =
    totalAmount.current + deliveryFee + tax - discount;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl p-4 mx-auto bg-white rounded-md shadow-md sm:p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col items-center justify-between mb-4 sm:mb-6 md:flex-row">
          <h1 className="text-xl font-semibold md:text-2xl">
            Cart Items - {cartItems.length}
          </h1>
          <button
            className="px-3 py-1 text-sm text-white bg-red-500 rounded-md hover:bg-red-600"
            onClick={handleClearCart}
          >
            Clear Cart
          </button>
        </div>

        {/* Location Section */}
        <div className="flex items-center justify-between p-4 mb-4 rounded-md bg-gray-50">
          <span className="text-sm font-medium text-gray-600">
            Delivery Location:
          </span>
          <span className="text-sm font-semibold">{location}</span>
        </div>

        {/* Empty Cart Message */}
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
            {/* Cart Items */}
            <div className="space-y-3">
              {cartItems.map((item) => {
                totalHandler(item?.price, item?.quantity);
                return <FoodItemCart key={item.id} item={item} />;
              })}
            </div>

            {/* Charges and Summary */}
            <div className="p-4 mt-6 border-t sm:p-6">
              <div className="flex items-center justify-between text-sm">
                <span>Subtotal:</span>
                <span>₹{(totalAmount.current / 100).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Delivery Fee:</span>
                <span>₹{(deliveryFee / 100).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Taxes (5% GST):</span>
                <span>₹{(tax / 100).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-green-600">
                <span>Discount:</span>
                <span>-₹{(discount / 100).toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between mt-4 text-lg font-semibold">
                <span>Grand Total:</span>
                <span>₹{(grandTotal / 100).toFixed(2)}</span>
              </div>

              {/* Checkout Button */}
              <button
                className="w-full py-2 mt-4 text-sm font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                onClick={handleCheckoutCart}
              >
                Proceed to Payment
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
