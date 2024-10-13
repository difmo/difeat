import { IMG_CDN_URL } from "../constants";
import { useDispatch } from "react-redux";
import { removeItem, decrQuantity, incrQuantity } from "../utils/cartSlice";

const FoodItemCart = ({ item }) => {
  const { name, description, category, imageId, price, defaultPrice, quantity } = item;
  const dispatch = useDispatch();

  // Function to truncate the description if it exceeds 26 characters.
  const truncateDescription = (text, maxLength = 26) => 
    text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

  const handleRemoveItem = () => {
    dispatch(removeItem(item));
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4 bg-white rounded-lg shadow-md md:flex-row">
      {/* Image Section */}
      <img
        className="object-cover w-20 h-20 rounded-lg md:w-24 md:h-24"
        src={IMG_CDN_URL + imageId}
        alt={name}
      />

      {/* Details Section */}
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-lg font-medium">{name}</h2>
        <p className="mt-1 text-sm text-gray-500">
          {truncateDescription(description || category)}
        </p>
        <h4 className="mt-2 font-semibold text-indigo-600">
          ₹{(price / 100 || defaultPrice / 100).toFixed(2)}
        </h4>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-3">
        <button
          className="flex items-center justify-center w-8 h-8 text-xl text-red-500 bg-gray-100 rounded-full hover:bg-red-200"
          onClick={() =>
            quantity > 1 ? dispatch(decrQuantity(item)) : handleRemoveItem()
          }
        >
          –
        </button>
        <span className="text-lg font-bold">{quantity}</span>
        <button
          className="flex items-center justify-center w-8 h-8 text-xl text-green-500 bg-gray-100 rounded-full hover:bg-green-200"
          onClick={() => dispatch(incrQuantity(item))}
        >
          +
        </button>
      </div>

      {/* Remove Button */}
      <button
        className="px-4 py-2 mt-4 text-sm font-medium text-white transition bg-red-500 rounded-lg md:mt-0 md:ml-6 hover:bg-red-600"
        onClick={handleRemoveItem}
      >
        Remove
      </button>
    </div>
  );
};

export default FoodItemCart;
