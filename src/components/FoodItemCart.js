import { IMG_CDN_URL } from "../constants";
import { useDispatch } from "react-redux";
import { removeItem, decrQuantity, incrQuantity } from "../utils/cartSlice";

const FoodItemCart = ({ item }) => {
  const { name, description, category, imageId, price, defaultPrice, quantity } = item;
  const dispatch = useDispatch();

  // Truncate the description if it's longer than 26 characters
  const truncateDescription = (text, maxLength = 26) =>
    text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

  const handleRemoveItem = () => {
    dispatch(removeItem(item));
  };

  return (
    <div className="flex items-center gap-4 p-4 transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg md:gap-6">
      {/* Image Section */}
      <img
        className="object-cover w-16 h-16 rounded-lg md:w-20 md:h-20"
        src={IMG_CDN_URL + imageId}
        alt={name}
      />

      {/* Details Section */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="mt-1 text-sm text-gray-500">
          {truncateDescription(description || category)}
        </p>
        <h4 className="mt-1 font-semibold text-indigo-600">
          ₹{(price / 100 || defaultPrice / 100).toFixed(2)}
        </h4>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          className="w-8 h-8 text-xl font-bold text-red-500 bg-gray-100 rounded-full hover:bg-red-200"
          onClick={() =>
            quantity > 1 ? dispatch(decrQuantity(item)) : handleRemoveItem()
          }
        >
          –
        </button>
        <span className="text-lg font-bold">{quantity}</span>
        <button
          className="w-8 h-8 text-xl font-bold text-green-500 bg-gray-100 rounded-full hover:bg-green-200"
          onClick={() => dispatch(incrQuantity(item))}
        >
          +
        </button>
      </div>

      {/* Remove Button */}
      <button
        className="px-3 py-1 text-sm text-white transition-colors duration-300 bg-red-500 rounded-lg hover:bg-red-600"
        onClick={handleRemoveItem}
      >
        Remove
      </button>
    </div>
  );
};

export default FoodItemCart;
