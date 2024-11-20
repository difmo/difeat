import { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { firestore, auth,collection, getDocs, query, where } from "../../../firebase";
import userContext from "../../utils/userContext";

const Home = (storeId,userId) => {
  const { user, setUser } = useContext(userContext);
  const [userIds, setUserId] = useState(null);
  const [storeDetails, setStoreDetails] = useState(null);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-bold  mb-6">Home</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Product Count Card */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800">Total Products</h2>
          <p className="text-4xl font-bold text-blue-500">{productCount}</p>
        </div>
        
        {/* Order Count Card */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800">Total Orders</h2>
          <p className="text-4xl font-bold text-green-500">{orderCount}</p>
        </div>
        
        {/* Store Details Card */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800">Store Details</h2>
          <div className="space-y-2">
            <p className="text-gray-600"><strong>Store Name:</strong> {storeDetails?.storeName || "Not Available"}</p>
            <p className="text-gray-600"><strong>Location:</strong> {storeDetails?.location || "Not Available"}</p>
            <p className="text-gray-600"><strong>Contact:</strong> {storeDetails?.contact || "Not Available"}</p>
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default Home;
