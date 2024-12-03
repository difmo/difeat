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
    <div className="transform transition-transform duration-500 hover:scale-95">
    
    <div className="flex flex-col bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 w-full max-w-[280px] overflow-hidden">
      {/* Image Section with Gradient Overlay */}
      <div className="relative">
        <img
          className="w-full h-44 object-cover"
          src={storeImageUrl || "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/nfel9opc4kcql9a24tfo"}  
          alt={storeName}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent rounded-t-xl"></div>
        {offer && (
           
        <div className="absolute bottom-2 left-2  text-white text-xl font-extrabold   px-3 py-1 rounded-lg">
             {offer}% OFF 
          </div>
        )}
      </div>

      {/* Restaurant Details */}
      
    </div>
    <div className="py-4 px-1 space-y-3">
        <h2 className="text-lg font-bold text-gray-900 truncate">
          {storeName || "ABC"}
        </h2>
        <p className="text-lg font-semibold text-gray-600 truncate">
          {types || "Multi-cuisine"}
        </p>
 
        <div className="flex items-center justify-between text-gray-600 text-sm">
          <div className="flex items-center gap-2">
            <span className="flex items-center bg-[#fa4b0a24] text-[#fa4b0a] px-2 py-1 rounded-md text-sm font-semibold">
              {avgRating || "4.2"} ★
            </span>
            <span className="text-sm font-semibold">{deliveryTime || "30-40 mins"}</span>
          </div>
          <span className="font-medium text-gray-700">₹{costForTwo || 300}</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
