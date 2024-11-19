import { useDispatch } from "react-redux";
import { removeItem, decrQuantity, incrQuantity } from "../utils/cartSlice";

const FoodItemCart = ({ item }) => {
  const { name, description, category, productImageUrl, price, defaultPrice, quantity } = item;
  const dispatch = useDispatch();

  const truncateDescription = (text, maxLength = 26) =>
    text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

  const handleRemoveItem = () => {
    dispatch(removeItem(item));
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-md shadow-sm hover:shadow-md">
      <img
        className="object-cover w-16 h-16 rounded-md sm:w-20 sm:h-20"
        src={productImageUrl}
        alt={name}
      />

      <div className="flex-1">
        <h2 className="text-sm font-semibold sm:text-base">{name}</h2>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          {truncateDescription(description || category)}
        </p>
        <h4 className="mt-1 font-medium text-indigo-600">
          ₹{(price / 100 || defaultPrice / 100).toFixed(2)}
        </h4>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="text-lg font-bold text-red-500 bg-gray-100 rounded-full w-7 h-7 hover:bg-red-200"
          onClick={() =>
            quantity > 1 ? dispatch(decrQuantity(item)) : handleRemoveItem()
          }
        >
          –
        </button>
        <span className="text-sm font-semibold">{quantity}</span>
        <button
          className="text-lg font-bold text-green-500 bg-gray-100 rounded-full w-7 h-7 hover:bg-green-200"
          onClick={() => dispatch(incrQuantity(item))}
        >
          +
        </button>
      </div>

      <button
        className="px-2 py-1 text-xs text-white bg-red-500 rounded-md hover:bg-red-600"
        onClick={handleRemoveItem}
      >
        Remove
      </button>
    </div>
  );
};

export default FoodItemCart;
