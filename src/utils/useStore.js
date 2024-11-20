import { useState, useEffect } from "react";
import { firestore, doc, getDoc, collection, getDocs } from "../../firebase";

const useStore = (storeId) => {
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (storeId) {
      fetchStoreData(storeId);
      fetchProducts(storeId);
    } else {
      setStore(null);
      setProducts([]);
      setIsLoading(false);
    }
  }, [storeId]);

  // Fetch store data
  const fetchStoreData = async (storeId) => {
    try {
      setIsLoading(true);
      const storeDocRef = doc(firestore, "stores", storeId);
      const storeDoc = await getDoc(storeDocRef);
      if (storeDoc.exists()) {
        setStore(storeDoc.data());
      } else {
        setStore(null);
        console.warn(`No store found for ID: ${storeId}`);
      }
    } catch (err) {
      console.error("Error fetching store data:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products from the store's subcollection
  const fetchProducts = async (storeId) => {
    try {
      const productsCollectionRef = collection(firestore, "stores", storeId, "products");
      const productsSnapshot = await getDocs(productsCollectionRef);
      const productsList = productsSnapshot.docs.map((doc) => (doc.data()));
      setProducts(productsList);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err);
    }
  };

  return { store, products, isLoading, error };
};

export default useStore;
