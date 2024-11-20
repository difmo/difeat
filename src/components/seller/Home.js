import { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { firestore, auth,collection, getDocs, query, where } from "../../../firebase";
import userContext from "../../utils/userContext";
import LoaderComponent from "../LoaderComponent";

const Home = (storeId,userId) => {
  const { user, setUser } = useContext(userContext);
  const [userIds, setUserId] = useState(null);
  const [storeDetails, setStoreDetails] = useState(null);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);

    const fetchSellerData = async (userId) => {
      try {
        setIsLoading(true);
        console.log("Home userId : ",userId);
        console.log("Home  storeId :",storeId.storeId);
        // Fetch store details
        const storesCollectionRef = collection(firestore, "stores");
        const q = query(storesCollectionRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const storeDoc = querySnapshot.docs[0];
          setStoreDetails(storeDoc.data());
          console.log('Store data:', storeDoc.data());
        } else {
          console.log("No store found for this user.");
        }

        // Fetch product count
        const productsCollectionRef = collection(firestore, "stores", storeId.storeId, "products");
        const productSnapshot = await getDocs(productsCollectionRef);
        const productsList = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setProductCount(productsList.length);

        // Fetch order count
        const ordersCollectionRef = collection(firestore, "orders");
        const ordersQuery = query(
          ordersCollectionRef,
          where("storeId", "==", storeId.storeId)
        );
      
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersList = ordersSnapshot.docs.map((doc) => (doc.data()));
        console.log("ordersList",ordersList)
        setOrderCount(ordersList.length);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };





  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserId(currentUser.uid);
      fetchSellerData(currentUser.uid);
    } else {
      setIsLoading(false);
    }
  }, []);


  if (isLoading) {
    return <LoaderComponent/>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Products */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-600">Total Products</h2>
          <p className="text-4xl font-bold text-blue-600">{productCount}</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-600">Total Orders</h2>
          <p className="text-4xl font-bold text-green-600">{orderCount}</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-600">Total Revenue</h2>
          <p className="text-4xl font-bold text-yellow-500">${totalRevenue.toFixed(2)}</p>
        </div>

        {/* Store Details */}
        <div className="bg-white shadow-lg rounded-lg p-6 col-span-1 md:col-span-2">
          <h2 className="text-lg font-semibold text-gray-600">Store Details</h2>
          <div className="space-y-2">
            <p><strong>Name:</strong> {storeDetails?.storeName || "N/A"}</p>
            <p><strong>Location:</strong> {storeDetails?.location || "N/A"}</p>
            <p><strong>Contact:</strong> {storeDetails?.contact || "N/A"}</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white shadow-lg rounded-lg p-6 col-span-1 md:col-span-2 lg:col-span-3">
          <h2 className="text-lg font-semibold text-gray-600 mb-4">Recent Orders</h2>
          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm"
                >
                  <p className="text-gray-700">
                    <strong>Order ID:</strong> {order.orderId || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    <strong>Amount:</strong> ${order.totalAmount?.toFixed(2) || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    <strong>Status:</strong> {order.status || "Pending"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent orders.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;