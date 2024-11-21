import { useEffect, useState } from "react";
import { YOUR_GOOGLE_MAPS_API_KEY } from "../constants";

const useGeoLocation = () => {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: "", lng: "" },
    address: "",
  });

  const success = async (location) => {
    const { latitude, longitude } = location.coords;
    setLocation({
      ...location,
      loaded: true,
      coordinates: { lat: latitude, lng: longitude},
    });

    // Fetch address using reverse geocoding
    try {
      const response = await fetch( `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${YOUR_GOOGLE_MAPS_API_KEY}`);
      const data = await response.json();

      if (data?.results?.length) {
        setLocation((prev) => ({
          ...prev,
          address: data.results[0].formatted_address,
        }));
      } else {
        setLocation((prev) => ({
          ...prev,
          address: "Address not found",
        }));
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setLocation((prev) => ({
        ...prev,
        address: "Unable to fetch address",
      }));
    }
  };

  const error = (err) => {
    setLocation({
      loaded: true,
      errorMessage: err.message || "Unknown Error",
    });
  };

  useEffect(() => {
    if (!navigator?.geolocation) {
      error({
        code: 0,
        message: "Geolocation not supported in browser",
      });
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }, []);

  return location;
};

export default useGeoLocation;
