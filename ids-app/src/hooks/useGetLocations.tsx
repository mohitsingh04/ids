import { useCallback, useEffect, useState } from "react";
import { getErrorResponse } from "../context/Callbacks";
import { API } from "../context/API";
import type { CityProps, CountryProps, StateProps } from "../types/types";

export default function useGetLocations() {
  const [state, setState] = useState<StateProps[]>([]);
  const [city, setCity] = useState<CityProps[]>([]);
  const [country, setCountry] = useState<CountryProps[]>([]);

  const getLocations = useCallback(async () => {
    try {
      const [cityRes, stateRes, countryRes] = await Promise.allSettled([
        API.get("/cities"),
        API.get("/states"),
        API.get("/countries"),
      ]);

      if (cityRes.status === "fulfilled") {
        setCity(cityRes.value.data || []);
      }
      if (stateRes.status === "fulfilled") {
        setState(stateRes.value.data || []);
      }
      if (countryRes.status === "fulfilled") {
        setCountry(countryRes.value.data || []);
      }
    } catch (error) {
      getErrorResponse(error, true);
    }
  }, []);

  useEffect(() => {
    getLocations();
  }, [getLocations]);
  return { city, state, country };
}
