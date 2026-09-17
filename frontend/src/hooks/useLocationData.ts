import { useState, useEffect } from 'react';
import { GetCountries, GetState, GetCity } from 'react-country-state-city';

export interface CountryItem {
  id: number;
  name: string;
  phone_code: string;
  iso2?: string;
  emoji?: string;
}

export interface StateItem {
  id: number;
  name: string;
  country_id: number;
  state_code?: string;
}

export interface CityItem {
  id: number;
  name: string;
  state_id: number;
  country_id: number;
}

export const useLocationData = (initialValues?: {
  country?: string;
  state?: string;
  city?: string;
  phone?: string;
}) => {
  const [countriesList, setCountriesList] = useState<CountryItem[]>([]);
  const [statesList, setStatesList] = useState<StateItem[]>([]);
  const [citiesList, setCitiesList] = useState<CityItem[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<CountryItem | null>(null);
  const [selectedState, setSelectedState] = useState<StateItem | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityItem | null>(null);

  const [phoneCode, setPhoneCode] = useState<string>('+971');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const [loadingCountries, setLoadingCountries] = useState<boolean>(true);
  const [loadingStates, setLoadingStates] = useState<boolean>(false);
  const [loadingCities, setLoadingCities] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // 1. Fetch countries on mount
  useEffect(() => {
    let isMounted = true;
    setLoadingCountries(true);
    GetCountries()
      .then((data: any) => {
        if (!isMounted) return;
        const list: CountryItem[] = data || [];
        setCountriesList(list);

        // Pre-select UAE or default if initial Values provided
        if (initialValues?.country) {
          const foundC = list.find(
            (c) => c.name.toLowerCase() === initialValues.country?.toLowerCase()
          );
          if (foundC) {
            setSelectedCountry(foundC);
            const code = foundC.phone_code.startsWith('+') ? foundC.phone_code : `+${foundC.phone_code}`;
            setPhoneCode(code);
          } else {
            // Default fallback
            const uae = list.find((c) => c.iso2 === 'AE' || c.name === 'United Arab Emirates');
            if (uae) {
              setSelectedCountry(uae);
              setPhoneCode('+971');
            }
          }
        } else {
          // Default to United Arab Emirates
          const uae = list.find((c) => c.iso2 === 'AE' || c.name === 'United Arab Emirates');
          if (uae) {
            setSelectedCountry(uae);
            setPhoneCode('+971');
          }
        }
      })
      .catch(() => {
        if (isMounted) setErrorMsg('Unable to load location data.');
      })
      .finally(() => {
        if (isMounted) setLoadingCountries(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Parse initial phone string if provided
  useEffect(() => {
    if (initialValues?.phone) {
      const p = initialValues.phone.trim();
      if (p.startsWith('+')) {
        const parts = p.split(' ');
        if (parts.length > 1) {
          setPhoneCode(parts[0]);
          setPhoneNumber(parts.slice(1).join(''));
        } else {
          // Match against phone code
          setPhoneNumber(p.replace(/^\+\d+\s*/, ''));
        }
      } else {
        setPhoneNumber(p);
      }
    }
  }, [initialValues?.phone]);

  // 2. Load States whenever selectedCountry changes
  useEffect(() => {
    if (!selectedCountry) {
      setStatesList([]);
      setSelectedState(null);
      setCitiesList([]);
      setSelectedCity(null);
      return;
    }

    let isMounted = true;
    setLoadingStates(true);
    setSelectedState(null);
    setSelectedCity(null);
    setCitiesList([]);

    GetState(selectedCountry.id)
      .then((data: any) => {
        if (!isMounted) return;
        const list: StateItem[] = data || [];
        setStatesList(list);

        if (initialValues?.state) {
          const foundS = list.find(
            (s) => s.name.toLowerCase() === initialValues.state?.toLowerCase()
          );
          if (foundS) {
            setSelectedState(foundS);
          }
        }
      })
      .catch(() => {
        if (isMounted) setStatesList([]);
      })
      .finally(() => {
        if (isMounted) setLoadingStates(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCountry?.id]);

  // 3. Load Cities whenever selectedState changes
  useEffect(() => {
    if (!selectedCountry || !selectedState) {
      setCitiesList([]);
      setSelectedCity(null);
      return;
    }

    let isMounted = true;
    setLoadingCities(true);
    setSelectedCity(null);

    GetCity(selectedCountry.id, selectedState.id)
      .then((data: any) => {
        if (!isMounted) return;
        const list: CityItem[] = data || [];
        setCitiesList(list);

        if (initialValues?.city) {
          const foundCity = list.find(
            (c) => c.name.toLowerCase() === initialValues.city?.toLowerCase()
          );
          if (foundCity) {
            setSelectedCity(foundCity);
          }
        }
      })
      .catch(() => {
        if (isMounted) setCitiesList([]);
      })
      .finally(() => {
        if (isMounted) setLoadingCities(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCountry?.id, selectedState?.id]);

  // Handlers for cascading selects
  const handleCountrySelect = (countryObj: CountryItem | null) => {
    setSelectedCountry(countryObj);
    setSelectedState(null);
    setSelectedCity(null);
    if (countryObj) {
      const code = countryObj.phone_code.startsWith('+') ? countryObj.phone_code : `+${countryObj.phone_code}`;
      setPhoneCode(code);
    }
  };

  const handleStateSelect = (stateObj: StateItem | null) => {
    setSelectedState(stateObj);
    setSelectedCity(null);
  };

  const handleCitySelect = (cityObj: CityItem | null) => {
    setSelectedCity(cityObj);
  };

  const resetLocation = (vals: { country?: string; state?: string; city?: string; phone?: string }) => {
    if (vals.country && countriesList.length > 0) {
      const foundC = countriesList.find((c) => c.name.toLowerCase() === vals.country?.toLowerCase());
      if (foundC) {
        setSelectedCountry(foundC);
        const code = foundC.phone_code.startsWith('+') ? foundC.phone_code : `+${foundC.phone_code}`;
        setPhoneCode(code);
      }
    }
    if (vals.phone) {
      const p = vals.phone.trim();
      if (p.startsWith('+')) {
        const parts = p.split(' ');
        if (parts.length > 1) {
          setPhoneCode(parts[0]);
          setPhoneNumber(parts.slice(1).join(''));
        } else {
          setPhoneNumber(p.replace(/^\+\d+\s*/, ''));
        }
      } else {
        setPhoneNumber(p);
      }
    }
  };

  const countryName = selectedCountry?.name || '';
  const stateName = selectedState?.name || '';
  const cityName = selectedCity?.name || '';
  const fullPhone = phoneNumber ? `${phoneCode} ${phoneNumber.trim()}` : '';

  return {
    countriesList,
    statesList,
    citiesList,
    selectedCountry,
    selectedState,
    selectedCity,
    phoneCode,
    phoneNumber,
    setPhoneNumber,
    setPhoneCode,
    loadingCountries,
    loadingStates,
    loadingCities,
    errorMsg,
    handleCountrySelect,
    handleStateSelect,
    handleCitySelect,
    resetLocation,
    countryName,
    stateName,
    cityName,
    fullPhone,
  };
};
