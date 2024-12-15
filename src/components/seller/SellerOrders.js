import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../../firebase";
import SellerOrderCard from "./SellerOrderCard";
import LoaderComponent from "../LoaderComponent";

const SellerOrders = ({ storeId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const ordersCollectionRef = collection(firestore, "orders");
        const ordersQuery = query(
          ordersCollectionRef,
          where("storeId", "==", storeId)
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersList = ordersSnapshot.docs.map((doc) => doc.data());
        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [storeId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Past Orders</h2>
      {loading ? (
        <LoaderComponent />
      ) : orders.length > 0 ? (
        <table className="table-auto border-collapse border border-gray-300 w-full shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Image</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Order Details</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Products</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Total Paid</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <SellerOrderCard key={order.orderId} order={order} />
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500">No past orders available</p>
      )}
    </div>
  );
};

export default SellerOrders;
