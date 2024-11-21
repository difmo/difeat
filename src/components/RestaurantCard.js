import { useContext } from "react";
import userContext from "../utils/userContext";

const RestaurantCard = (props) => {
  const { user } = useContext(userContext);
  const { resData } = props;
  const {
    storeImageUrl,
    storeName,
    avgRating,
    deliveryTime,
    costForTwo,
    types,
    offer,
  } = resData;

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 w-full max-w-[280px] overflow-hidden">
      {/* Image Section with Gradient Overlay */}
      <div className="relative">
        <img
          className="w-full h-40 object-cover"
          src={storeImageUrl || "/placeholder.jpg"} // Fallback image
          alt={storeName}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-t-xl"></div>
        {offer && (
          <div className="absolute bottom-2 left-2 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-lg">
            {offer}
          </div>
        )}
      </div>

      {/* Restaurant Details */}
      <div className="p-4 space-y-3">
        <h2 className="text-base font-semibold text-gray-900 truncate">
          {storeName}
        </h2>
        <p className="text-sm text-gray-600 truncate">
          {types || "Multi-cuisine"}
        </p>

        {/* Info Row */}
        <div className="flex items-center justify-between text-gray-600 text-sm">
          <div className="flex items-center gap-2">
            <span className="flex items-center bg-[#fa4b0a24] text-[#fa4b0a] px-2 py-1 rounded-md text-xs font-medium">
              {avgRating || "4.2"} ★
            </span>
            <span>{deliveryTime || "30-40 mins"}</span>
          </div>
          <span className="font-medium text-gray-700">₹{costForTwo || 300}</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
