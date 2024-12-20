import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IMG_CDN_URL } from "../constants";
import Shimmer from "./Shimmer";
import { ShimmerMenu } from "./Shimmer";
import RestaurantCategory from "./RestaurantCategory";
import useStore from "../utils/useStore";
import LoaderComponent from "./LoaderComponent";
 
const RestaurantMenu = () => {
  const { resId } = useParams();
  const { store, products,isLoading, error } = useStore(resId);
  const [showIndex, setShowIndex] = useState(0);

  console.log("hiiii",store);


  if (isLoading) {
    return (
      <LoaderComponent/>
      
    );
  }


  if (error) {
    return <div>Error loading store: {error.message}</div>;
  }

  if (!store) {
    return <div>No store found for the provided ID: {resId}</div>;
  }



  if (!store) return <ShimmerMenu />;


  return (
    <div className="flex flex-col   md:w-2/3   m-auto w-full">
      <div>
      <h2 className="text-2xl py-5 font-bold text-gray-900 truncate">
      {store?.storeName}
        </h2>
        
      </div>
      {/* <div className=" p-4  border-b md:flex-row gap-3  border rounded-2xl w-full">
        <div className="flex flex-col text-xs text-[#e5e6ec] font-medium gap-1">
           
          <span className="text-xl font-bold text-white">
            {store?.storeName}
          </span>
          <span className="">
            {store?.types}
          </span>
          <span className="">
          
            <span className="text-orange-600 font-bold">𖡡</span>
          </span>
          <span className="flex">
            <span className="flex items-center gap-1 px-1 mr-2 rounded-sm text-white bg-green-600  font-semibold">
              <span className="text-[0.7rem]">
                {store?.avgRating}{" "}
              </span>
              <span className="text-white text-[0.8rem]">★ </span>
            </span>
            | {store?.totalRatingsString}
          </span>
        </div>
        <img
          className="w-56 h-36 rounded"
          src={
            store?.storeImageUrl
          }
        />
        <div className="flex items-center space-x-2    py-2  ">
  <span className="text-[#fa4b0a] text-2xl font-bold">★</span>
  <span className="text-gray-800 text-lg font-semibold">
    <span className="text-[#fa4b0a]">4.2</span> (89 ratings) • ₹700 for two
  </span>
</div>
<div>
Pizzas, Fast Food
  
</div>

      </div> */}

<div className="p-4 border-b border rounded-2xl w-full bg-white shadow-lg shadow-black/5">
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-2 py-2">
      <span className="text-[#24a247] text-2xl font-bold">★</span>
      <span className="text-gray-800 text-lg font-semibold">
        <span className="text-[#24a247]">4.2</span> (89 ratings) • ₹700 for two
      </span>
    </div>
  </div>
  <div className="text-gray-600 text-sm font-medium mt-1">
    <span className="text-[#fa4b0a] hover:underline cursor-pointer">Pizzas</span>, <span className="text-[#fa4b0a] hover:underline cursor-pointer">Fast Food</span>
  </div>
  <div className="mt-2 text-sm text-gray-700 space-y-1">
    <div>
      <span className="font-bold">Outlet:</span> GOMTI NAGAR
    </div>
    <div>30–35 mins</div>
  </div>
</div>



      {/* <div className="flex gap-8 items-center border-b p-4 text-sm md:text-base">
        <div className="flex items-center gap-2 font-semibold">
          <svg
            className="RestaurantTimeCost_icon__8UdT4"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
          >
            <circle
              r="8.35"
              transform="matrix(-1 0 0 1 9 9)"
              stroke="#3E4152"
              strokeWidth="1.3"
            ></circle>
            <path
              d="M3 15.2569C4.58666 16.9484 6.81075 18 9.273 18C14.0928 18 18 13.9706 18 9C18 4.02944 14.0928 0 9.273 0C9.273 2.25 9.273 9 9.273 9C6.36399 12 5.63674 12.75 3 15.2569Z"
              fill="#3E4152"
            ></path>
          </svg>
          <span className="">
            {store?.deliveryTime || " 30-40 MINS "}..
          </span>
        </div>
        <div className="flex items-center gap-2 font-semibold">
          <svg
            className="RestaurantTimeCost_icon__8UdT4"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
          >
            <circle
              cx="9"
              cy="9"
              r="8.25"
              stroke="#3E4152"
              strokeWidth="1.5"
            ></circle>
            <path
              d="M12.8748 4.495H5.6748V6.04H7.9698C8.7948 6.04 9.4248 6.43 9.6198 7.12H5.6748V8.125H9.6048C9.3798 8.8 8.7648 9.22 7.9698 9.22H5.6748V10.765H7.3098L9.5298 14.5H11.5548L9.1098 10.57C10.2048 10.39 11.2698 9.58 11.4498 8.125H12.8748V7.12H11.4348C11.3148 6.475 10.9698 5.905 10.4298 5.5H12.8748V4.495Z"
              fill="#3E4152"
            ></path>
          </svg>
          <span className="">
            
          </span>
        </div>
      </div> */}
 
      <RestaurantCategory
          data={products}
          storeId={store.storeId}/>
    </div>
  );
};

export default RestaurantMenu;
