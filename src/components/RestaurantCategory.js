import { useState } from "react";
import ItemList from "./ItemList";

const RestaurantCategory = ({data,storeId}) => {
    const handleClick=()=>{
      setShowIndex();
    }
  return(
    <div>
        <div className=" mx-auto my-4 bg-gray-50 shadow-lg p-4 ">
            <div className="flex justify-between  pb-2 cursor-pointer border-b-2 border-spacing-1 mb-1" onClick={handleClick}>
            <span className="font-bold text-lg ">Total Products :  ({data.length})</span>
            <span className="font-bold text-lg">&#8650;</span>
            </div>
          <ItemList items={data} storeId={storeId}/>
        </div>
    </div>
  )
};

export default RestaurantCategory;