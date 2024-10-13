import { IMG_CDN_URL } from "../constants";
import { useDispatch } from "react-redux";
import { removeItem, decrQuantity, incrQuantity } from "../utils/cartSlice";

const FoodItemCart = ({ item }) => {
  const { name, description, category, imageId, price, defaultPrice, quantity } = item;

  const dispatch = useDispatch();

  const handleRemoveItem = (item) => {
    dispatch(removeItem(item));
  };

  return (
    <div className="flex items-center p-4 my-4 bg-white rounded-lg shadow-sm">
      {/* Image Section */}
      <img
        className="object-cover w-24 h-24 rounded-lg"
        src={IMG_CDN_URL + imageId}
        alt={name}
      />

      {/* Details Section */}
      <div className="flex-1 ml-4">
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-sm text-gray-500">
          {description || category}
        </p>
        <h4 className="mt-1 font-bold text-indigo-600">
          ₹{(price / 100 || defaultPrice / 100).toFixed(2)}
        </h4>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center">
        <button
          className="px-3 py-1 text-xl text-red-500 bg-gray-100 rounded-lg hover:bg-red-100"
          onClick={() =>
            quantity > 1
              ? dispatch(decrQuantity(item))
              : handleRemoveItem(item)
          }
        >
          –
        </button>
        <span className="mx-3 text-lg font-bold">{quantity}</span>
        <button
          className="px-3 py-1 text-xl text-green-500 bg-gray-100 rounded-lg hover:bg-green-100"
          onClick={() => dispatch(incrQuantity(item))}
        >
          +
        </button>
      </div>
      <button
        className="px-4 py-2 ml-6 text-sm text-white transition bg-red-500 rounded-lg hover:bg-red-600"
        onClick={() => handleRemoveItem(item)}
      >
        Remove
      </button>
    </div>
  );
};

export default FoodItemCart;
