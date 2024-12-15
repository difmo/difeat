import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore, auth } from "../../../firebase";
import useStore from "../../utils/useStore";

const SellerOrderCard = ({ order }) => {
  const { store } = useStore(order.storeId); // Assuming useStore provides store info

  if (!store) {
    return <tr><td colSpan="5" className="text-center text-gray-500">Store details not available</td></tr>;
  }

  return (
    <tr className="bg-white">
      <td className="border border-gray-300 px-4 py-2">
        <img
          src={store.storeImageUrl || "https://via.placeholder.com/100"}
          alt={store.storeName || "Order"}
          className="w-24 h-24 rounded-md"
        />
      </td>
      <td className="border border-gray-300 px-4 py-2">
        <h3 className="text-lg font-semibold">{store.storeName || "Unknown Restaurant"}</h3>
        <p className="text-sm text-gray-500">{order.location || "Location not available"}</p>
        <p className="text-xs text-gray-400">
          ORDER #{order.orderId} |{" "}
          {order.orderDate
            ? new Date(order.orderDate.seconds * 1000).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "Date not available"}
        </p>
      </td>
      <td className="border border-gray-300 px-4 py-2">
        {order.products
          ? order.products.map((item) => `${item.name} (x${item.quantity})`).join(", ")
          : "No items available"}
      </td>
      <td className="border border-gray-300 px-4 py-2">
        <p className="text-gray-700 font-semibold">₹{order.totalPrice || 0}</p>
      </td>
      <td className="border border-gray-300 px-4 py-2">
        <div className="flex flex-col space-y-2">
          <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
            REORDER
          </button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
            HELP
          </button>
        </div>
      </td>
    </tr>
  );
};

export default SellerOrderCard;

