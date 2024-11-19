import { useContext } from "react";
import userContext from "../utils/userContext";

const RestrauntCard = (props) => {
  const { user } = useContext(userContext);
  const { resData } = props;
  const {
    storeImageUrl,
    storeName,
    avgRating,
    deliveryTime,
    costForTwo,
    types,
  } = resData;

  return (
    <div className="flex flex-col gap-4 bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 sm:w-72 w-full">
      {/* Image */}
      <div className="relative">
        <img
          className="w-full h-40 object-cover"
          src={storeImageUrl}
          alt={storeName}
        />
        <div className="absolute bottom-0 right-0 bg-green-600 text-white text-xs font-bold py-1 px-2 rounded-tl-lg">
          {avgRating === "--" ? "4.2" : avgRating} ★
        </div>
      </div>

      {/* Restaurant Details */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800 truncate">{storeName}</h2>
        <p className="text-sm text-gray-600">{types}</p>

        {/* Info Row */}
        <div className="flex items-center justify-between mt-3 text-gray-500 text-sm">
          <span>{deliveryTime} Mins Away</span>
          <div className="w-[4px] h-[4px] rounded-full bg-gray-400 mx-2"></div>
          <span>₹{costForTwo}</span>
        </div>
      </div>
    </div>
  );
};

export default RestrauntCard;
