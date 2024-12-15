 
import { addItem } from "../utils/cartSlice";
import { useDispatch } from "react-redux";

const ItemList = ({ items, storeId }) => {
  const dispatch = useDispatch();

  const addFoodItem = (item, storeId) => {
    dispatch(
      addItem({
        storeId: storeId,
        name: item.name,
        price: item.price || item.price,
        productImageUrl: item?.productImageUrl,
        quantity: item.quantity,
        productId: item?.productId,
        description: item?.description,
        category: item?.category,
      })
    );
  };

  return (
    <div className="p-4">
      {items.map((item) => {
        // const avgRating = item?.avgRating || "4.2";  // Using the rating or default to "4.2"
        return (
          <div
            className="flex flex-col md:flex-row justify-between items-center border rounded-lg shadow-sm bg-white p-4 mb-6 hover:shadow-md transition-shadow duration-300"
            // key={item?.card?.info?.id}
            key={item.id}
          >
            {/* Left Section */}
            <div className="flex flex-col gap-3 w-full md:w-3/4">
              <span className="text-lg font-bold text-gray-800">
                {item?.name}
              </span>
              
              {/* Rating Section */}
              <div className="flex items-center gap-1 text-green-500">
                <span className="font-semibold text-sm">4.2</span>
                <span className="text-sm">★</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold text-orange-600">
                  ₹{item.price || item.price}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {item?.description}
              </p>
            </div>

            {/* Right Section */}
            <div className="flex flex-col items-center gap-3 md:w-1/4 w-auto">
              <img
                className="w-32 h-24 rounded-md object-cover"
                src={item?.productImageUrl}
                alt="foodImage"
              />
              <button
                className="bg-orange-500 text-white font-medium rounded-lg px-4 py-2 shadow-md hover:bg-orange-600 active:scale-95 transition-transform duration-200 ease-in-out"
                onClick={() => addFoodItem(item, storeId)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ItemList;
