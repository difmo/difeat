import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore, auth } from "../../firebase";
import useStore from "../utils/useStore";

const OrderCard = ({order}) => {
  const { store, products,isLoading, error } = useStore(order.storeId);

  if (isLoading) {
    return <div></div>;
  }

  if (error) {
    return <div>Error loading store: {error.message}</div>;
  }

  if (!store) {
    return <div>No store found for the provided ID: {order.storeId}</div>;
  }
console.log(store, "store");
  return (
    <div
      key={order.id}
      className="border border-gray-300 rounded-lg p-4 mb-6 flex items-start bg-white shadow-md"
    >
      {/* Image */}
      <img
        src={store.storeImageUrl  || "https://via.placeholder.com/100"} // Placeholder image if `imageUrl` is missing
        alt={store.storeName || "Order"}
        className="w-24 h-24 rounded-md mr-4"
      />

      {/* Order Details */}
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">
              {store.storeName || "Unknown Restaurant"}
            </h3>
            <p className="text-sm text-gray-500">{order.location || "Location not available"}</p>
            <p className="text-xs text-gray-400">
              ORDER #{order.orderId} |{" "}
              {order.orderDate
                ?  new Date(order.orderDate.seconds * 1000).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
                : "Date not available"}
            </p>
          </div>
          <div className="text-right">
      
            <span className=" text-sm">   Delivered :  {order.orderDate
                ?  new Date(order.orderDate.seconds * 1000).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
                : "Date not available"} </span>
          </div>
        </div>

        <button className="text-orange-500 font-medium mt-1">VIEW DETAILS</button>

        <p className="mt-2 text-sm">  
          {order.products? order.products.map((item) => `${item.name} (x${item.quantity})`).join(", ")
            : "No items available"}
        </p>

        <div className="flex justify-between items-center mt-2">
          <p className="text-gray-700 font-semibold">
            Total Paid: ₹{order.totalPrice || 0}
          </p>
        </div>

        <div className="flex space-x-4 mt-4">
          <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
            REORDER
          </button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
            HELP
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
