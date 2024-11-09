import React, { useEffect, useState } from "react";
import { collection, getDocs, firestore, auth } from "../../firebase";

const Orders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const ordersCollectionRef = collection(firestore, "difeatusers", auth.currentUser.uid, "orders");
            const ordersSnapshot = await getDocs(ordersCollectionRef);
            setOrders(ordersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        };
        fetchOrders();
    }, []);
                 
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Past Orders</h2>
            {orders.length > 0 ? (
                orders.map(order => (
                    <div key={order.id} className="border border-gray-300 rounded-lg p-4 mb-6 flex items-start bg-white shadow-md">
                    <img src={order.imageUrl} alt={order.restaurantName} className="w-24 h-24 rounded-md mr-4" />
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold">{order.restaurantName}</h3>
                          <p className="text-sm text-gray-500">{order.location}</p>
                          <p className="text-xs text-gray-400">ORDER #{order.orderId} | {new Date(order.orderDate).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          {/* <p className="text-sm text-gray-400">Delivered on {order&&order.deliveryDate!=null?new Date(order.deliveryDate).toLocaleString():""}</p> */}
                          <span className="text-green-500 text-xl">✔️</span>
                        </div>
                      </div>
                  
                      <button className="text-orange-500 font-medium mt-1">VIEW DETAILS</button>
                  
                      <p className="mt-2 text-sm">{order.items}</p>
                  
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-gray-700 font-semibold">Total Paid: ₹{order.totalPrice}</p>
                      </div>
                  
                      <div className="flex space-x-4 mt-4">
                        <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">REORDER</button>
                        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">HELP</button>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
                <p className="text-center text-gray-500">No past orders available</p>
            )}
        </div>
    );
};

export default Orders;
