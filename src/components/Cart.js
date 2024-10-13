import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../utils/cartSlice";
import FoodItemCart from "./FoodItemCart";
import { useRef } from "react";

const Cart = () => {
  const cartItems = useSelector((store) => store.cart.items);
  const dispatch = useDispatch();
  let totalAmount = useRef(0);

  const handleCheckoutCart = () => {
   console.log((totalAmount.current / 100).toFixed(2));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  totalAmount.current = 0;

  const totalHandler = (price, quantity) => {
    totalAmount.current = Number(totalAmount.current) + price * quantity;
  };

  return (
    <div className="min-h-screen py-10 bg-gray-100">
      <div className="md:w-3/5 w-[90%] mx-auto p-6 bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold">Cart Items - {cartItems.length}</h1>
          <button
            className="px-4 py-2 text-sm font-medium text-white transition bg-red-500 rounded-lg hover:bg-red-600"
            onClick={handleClearCart}
          >
            Clear Cart
          </button>
        </div>

        {/* Empty Cart Message */}
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <h2 className="text-2xl font-semibold text-gray-600">Your Cart is Empty 🛒</h2>
            <p className="mt-2 text-gray-500">Add items to the cart to see them here.</p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-6">
              {cartItems.map((item) => {
                totalHandler(item?.price, item?.quantity);
                return <FoodItemCart key={item.id} item={item} />;
              })}
            </div>

            {/* Cart Summary */}
            <div className="p-4 mt-8 border-t">
              <div className="flex items-center justify-between text-xl font-semibold">
                <span>Total:</span>
                <span>&#8377; {(totalAmount.current / 100).toFixed(2)}</span>
              </div>

              {/* Checkout Button */}
              <button 
                className="w-full py-3 mt-6 text-lg font-bold text-white transition-all bg-indigo-600 rounded-lg hover:bg-indigo-700"
              onClick={handleCheckoutCart}
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
