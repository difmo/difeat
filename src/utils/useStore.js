import { useState, useEffect } from "react";
import { firestore, doc, getDoc } from "../../firebase";

const useStore = (storeId) => {
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (storeId) {
      fetchStoreData(storeId);
    } else {
      setStore(null);
      setIsLoading(false);
    }
  }, [storeId]);

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
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching store data:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { store, isLoading, error };
};

export default useStore;
