import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore, auth } from "../../firebase";
import OrderCard from "./OrderCard";
import LoaderComponent from "./LoaderComponent";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Reference to the 'orders' collection
        const ordersCollectionRef = collection(firestore, "orders");
        
        // Query to fetch orders where userId matches the current user's UID
        const ordersQuery = query(
          ordersCollectionRef,
          where("userId", "==", auth.currentUser.uid)
        );
        
        // Fetch data from Firestore
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersList = ordersSnapshot.docs.map((doc) => (doc.data()));

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
         <LoaderComponent/>
      ) : orders.length > 0 ? (
        orders.map((order) => (
        <OrderCard 
        key={order.orderId}
        order={order}/>
        ))
      ) : (
        <p className="text-center text-gray-500">No past orders available</p>
      )}
    </div>
  );
};

export default Orders;
