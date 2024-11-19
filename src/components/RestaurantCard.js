import { IMG_CDN_URL } from "../constants";
import { useContext } from "react";
import userContext from "../utils/userContext";

const RestrauntCard = (props) => {
  const {user} = useContext(userContext);
  const {resData} = props;
  console.log(resData)
  const {storeImageUrl ,storeName, avgRating, deliveryTime, costForTwo,types,storeId} = resData;
  return (
    <div className="md:w-64 md:h-80 shadow-md md:shadow-none py-4 px-4 md:py-2 hover:shadow-lg rounded flex flex-col gap-1 text-[0.7rem] text-[#535665] lg:w-72">
      <img className="rounded object-cover" src={storeImageUrl} />
      <h2 className="font-semibold text-xl text-black">{storeName}</h2>
      <h3>{types}</h3>
      <div className="flex justify-between items-center my-2 font-medium">
          <div className="flex items-center gap-1 px-1 text-white bg-green-600  font-semibold">
            <span className="text-white text-[0.8rem]">★</span>
            <span className="text-[0.7rem]">
              {avgRating === "--" ? "4.2" : avgRating}
            </span>
          </div>
          <div className="w-[4px] h-[4px] rounded-full bg-black"></div>
          <span className="">{deliveryTime} MINS AWAY</span>
          <div className="w-[4px] h-[4px] rounded-full bg-black"></div>
          <span className="">{costForTwo}</span>
        </div>
      
    </div>
  );
};

export default RestrauntCard;
