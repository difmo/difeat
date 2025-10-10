import React, { useState, useEffect, useMemo, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import RestaurantCard from "./RestaurantCard";
import Shimmer from "./Shimmer";
import useOnline from "../utils/useOnline";
import userContext from "../utils/userContext";
import useGeoLocation from "./useGeoLocation";
import debounce from "lodash.debounce";

// Firebase imports (adjust according to how you export them)
import {
  auth,
  onAuthStateChanged,
  firestore,
  signOut,
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit as fsLimit,
} from "../../firebase";

// ------------------------
// Improved Body component
// - Robust auth handling + cleanup
// - Loading/error states and retry
// - Debounced search + client-side filter
// - Graceful geolocation handling (permission, loading, errors)
// - Offline detection
// - Skeleton and empty states
// - Safe rendering, fallbacks, defensive checks
// - Optional pagination (client-side)
// ------------------------

const PAGE_SIZE = 12;

const Body = () => {
  const { user, setUser } = useContext(userContext);
  const [allStores, setAllStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState(null);

  const isOnline = useOnline();
  const location = useGeoLocation();
  const navigate = useNavigate();
  const mountedRef = useRef(true);
  const authUnsubRef = useRef(null);

  // Load user + stores when auth ready
  useEffect(() => {
    mountedRef.current = true;

    const fetchForUser = async (uid) => {
      setLoading(true);
      setError(null);
      try {
        // example: we fetch user details if needed (safe guard)
        const userDocRef = doc(firestore, "difeatusers", uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUser((prev) => ({ ...(prev || {}), ...userDocSnap.data() }));
        }

        // Fetch stores - note: for large collections convert to paginated queries
        const storesCol = collection(firestore, "stores");
        // You can adjust ordering here
        const q = query(storesCol, orderBy("storeName", "asc"));
        const snap = await getDocs(q);
        if (!mountedRef.current) return;

        const stores = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setAllStores(stores);
        setFilteredStores(stores);
        setPage(1);
      } catch (err) {
        console.error("fetchForUser error:", err);
        if (!mountedRef.current) return;
        setError("Failed to load stores. Please try again.");
      } finally {
        if (!mountedRef.current) return;
        setLoading(false);
      }
    };

    // Subscribe to auth state
    authUnsubRef.current = onAuthStateChanged(auth, (u) => {
      if (u) {
        fetchForUser(u.uid);
      } else {
        // if your app requires auth, redirect to login
        setLoading(false);
        setAllStores([]);
        setFilteredStores([]);
        // optionally navigate to public landing page
        // navigate("/");
      }
    });

    return () => {
      // cleanup
      mountedRef.current = false;
      if (authUnsubRef.current) authUnsubRef.current();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search function (client-side filter)
  const runFilter = useMemo(() =>
    debounce((txt, stores) => {
      const q = (txt || "").trim().toLowerCase();
      if (!q) {
        setFilteredStores(stores);
        setPage(1);
        return;
      }

      const result = stores.filter((s) => {
        const name = (s.storeName || "").toLowerCase();
        const desc = Array.isArray(s.shopDescription) ? s.shopDescription.join(" ") : (s.shopDescription || "");
        const tags = Array.isArray(s.tags) ? s.tags.join(" ") : (s.tags || "");
        const combined = `${name} ${desc} ${tags}`.toLowerCase();
        return combined.includes(q);
      });

      setFilteredStores(result);
      setPage(1);
    }, 300), []);

  useEffect(() => {
    // call debounced filter
    runFilter(searchText, allStores);
  }, [searchText, allStores, runFilter]);

  // cleanup debounce on unmount
  useEffect(() => () => runFilter.cancel(), [runFilter]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil((filteredStores || []).length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return (filteredStores || []).slice(start, start + PAGE_SIZE);
  }, [filteredStores, page]);

  // Safe click handlers
  const handleCardClick = (store) => {
    if (!store || !store.storeId) return;
    navigate(`/restaurant/${store.storeId}`);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Sign out failed:", err);
      setNotification({ type: "error", message: "Sign out failed. Try again." });
    }
  };

  const retryLoad = async () => {
    setError(null);
    setLoading(true);
    try {
      const u = auth.currentUser;
      if (u) {
        const storesCol = collection(firestore, "stores");
        const snap = await getDocs(query(storesCol, orderBy("storeName", "asc")));
        const stores = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (!mountedRef.current) return;
        setAllStores(stores);
        setFilteredStores(stores);
      } else {
        setError("You are not signed in.");
      }
    } catch (err) {
      console.error("retryLoad error:", err);
      setError("Retry failed. Check console.");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  // render helpers
  if (!isOnline) return <div className="p-6 text-center">🔴 You appear offline. Please check your connection.</div>;
  if (loading) return <div className="p-6"><Shimmer /></div>;

  return (
    <div className="mx-6 lg:mx-12 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <input
            aria-label="Search restaurants"
            placeholder="Search for restaurants, descriptions or tags"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-64 px-3 py-2 rounded border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-yellow-400"
          />
          <button
            onClick={() => runFilter.cancel() || runFilter(searchText, allStores)}
            className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Search
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">{location?.address ? `Location: ${location.address}` : location?.loading ? "Detecting location..." : location?.error ? `Location error: ${location.error}` : "Location not available"}</div>
          <button onClick={handleSignOut} className="px-3 py-2 rounded bg-gray-800 text-white">Sign out</button>
        </div>
      </div>

      {error ? (
        <div className="p-5 rounded bg-rose-700/10 border border-rose-600 text-center mb-6">
          <p className="text-rose-700 mb-3">{error}</p>
          <div className="flex justify-center gap-3">
            <button onClick={retryLoad} className="px-4 py-2 rounded bg-indigo-600 text-white">Retry</button>
            <button onClick={() => { setError(null); setSearchText(""); }} className="px-4 py-2 rounded border">Reset</button>
          </div>
        </div>
      ) : null}

      {filteredStores.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 rounded">
          <h3 className="text-xl font-semibold mb-2">No restaurants found</h3>
          <p className="text-gray-600 mb-4">Try different keywords or remove filters.</p>
          <div className="flex justify-center gap-3">
            <button onClick={() => { setSearchText(""); setFilteredStores(allStores); }} className="px-4 py-2 rounded bg-indigo-600 text-white">Show all</button>
            <button onClick={retryLoad} className="px-4 py-2 rounded border">Retry load</button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
            {pageItems.map((store) => (
              <div key={store.storeId || store.id} className="group">
                <Link to={`/restaurant/${store.storeId || store.id}`} onClick={() => handleCardClick(store)}>
                  <RestaurantCard resData={store} />
                </Link>
              </div>
            ))}
          </div>

          {/* pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredStores.length)} of {filteredStores.length}</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded bg-gray-200">Prev</button>
              <div className="text-sm">Page {page} / {totalPages}</div>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded bg-gray-200">Next</button>
            </div>
          </div>
        </>
      )}

      {/* small notification */}
      {notification && (
        <div className={`fixed bottom-4 right-4 p-3 rounded shadow ${notification.type === 'error' ? 'bg-rose-600 text-white' : 'bg-green-600 text-white'}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default Body;
