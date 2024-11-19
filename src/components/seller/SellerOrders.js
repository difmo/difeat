import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore, auth } from "../../../firebase";
import OrderCard from "../OrderCard";
import SellerOrderCard from "./SellerOrderCard";

const SellerOrders = (storeId,userId) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
console.log("storeIdss  ",storeId.storeId);
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const ordersCollectionRef = collection(firestore, "orders");
        
        const ordersQuery = query(
          ordersCollectionRef,
          where("storeId", "==", storeId.storeId)
        );
        
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersList = ordersSnapshot.docs.map((doc) => (doc.data()));
        console.log("ordersList",ordersList)
        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Past Orders</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : orders.length > 0 ? (
        orders.map((order) => (
        <SellerOrderCard 
        key={order.orderId}
        order={order}/>
        ))
      ) : (
        <p className="text-center text-gray-500">No past orders available</p>
      )}
    </div>
  );
};

export default SellerOrders;
