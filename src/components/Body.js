import constants, { restaurantList } from "../constants";
import RestaurantCard from "./RestaurantCard";
import { useState, useEffect, useContext } from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import { filterData } from "../utils/helper";
import useOnline from "../utils/useOnline";
import userContext from "../utils/userContext";
import useGeoLocation from "./useGeoLocation";
import { current } from "@reduxjs/toolkit";
import {
  auth,
  onAuthStateChanged,
  firestore,
  storage,
  signOut,
  doc,
  getDoc,
  collection,
  getDocs,
} from "../../firebase";

const Body = (
  {
    /*user*/
  }
) => {
  const [allStores, setAllStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [searchText, setSearchText] = useState("");
  const { user, setUser } = useContext(userContext);
  const [geolocation, setGeoLocation] = useState();
  const [userDetails, setUserDetails] = useState(null);



  useEffect(() => {
    const fetchUserData = async (userUid) => {
      try {
        const userDocRef = doc(firestore, "difeatusers", userUid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserDetails(userDoc.data());
        } else {
          console.error("No such user document!");
        }
        const storesCollectionRef = collection(firestore, "stores");
        const storesSnapshot = await getDocs(storesCollectionRef);
        const stores = storesSnapshot.docs.map((doc) => ({...doc.data(),
        }));
  
        setAllStores(stores); 
        setFilteredStores(stores); 
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); 
      }
    };
  
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        // navigate("/"); 
      }
    });
  
    return () => unsubscribe();
  }, []); 
  



 
  useEffect(() => {
    getStores();
  }, []);

  const getStores = async () => {
    try {
      const storesCollectionRef = collection(firestore, "stores");
      const storesSnapshot = await getDocs(storesCollectionRef);
      const stores = storesSnapshot.docs.map((doc) => ({...doc.data(),
      }));

      setAllStores(stores); 
      setFilteredStores(stores); 
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // setIsLoading(false); 
    }
  };

  const isOnline = useOnline();

  if (!isOnline) {
    return <h1>🔴 Offline, please check your internet connection!!</h1>;
  }


  if (allStores?.length === 0) return <Shimmer />;
  return (
    <div className="mx-8 ">
      <div className="flex flex-col items-center justify-between md:flex md:flex-row">
        <div className="flex items-center gap-2 my-4 text-sm">
          <input
            type="text"
            className="w-64 px-2 py-2 ml-3 text-xs transition-all duration-300 border border-gray-300 rounded focus:border-yellow-500"
            placeholder="Search for restaurants & food"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
          <button
            className="text-xs font-medium shadow-md px-2 py-2 outline-none  rounded bg-[#fb0b0f] hover:bg-green-500 transition-all duration-200 ease-in-out text-white"
            onClick={() => {
              
              const filteredStores = allStores.filter(
                (store) =>
                  store?.storeName
                    .toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                    store?.shopDescription
                    .join(", ")
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
              );
              // update the state - restaurants
              setFilteredStores(filteredStores);
            }}
          >
            Search
          </button>
        </div>
      </div>
      <div>
         {location.loaded ? JSON.stringify(location) : "location is not available"}
        {location?.coordinates?.lat}
      </div>
      <div className="flex flex-col items-center justify-center gap-2 my-2 md:flex-row md:flex-wrap md:my-0">
        {/* You have to write logic for NO restraunt fount here */}
        {filteredStores?.map((store) => {
          return (
            <Link
              to={"/restaurant/" + store.storeId}
              key={store.storeId}
            >
              <RestaurantCard resData={store} user={user} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Body;
