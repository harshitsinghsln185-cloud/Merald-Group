import React from 'react';
import { Globe, MapPin, Building2, Phone } from 'lucide-react';
import { useLocationData } from '../../hooks/useLocationData';

interface LocationFieldsProps {
  location?: ReturnType<typeof useLocationData>;
  locationHook?: ReturnType<typeof useLocationData>;
  customCityValue?: string;
  onCustomCityChange?: (val: string) => void;
  showPhoneInput?: boolean;
  phoneLabel?: string;
  phoneError?: string;
  countryError?: string;
  stateError?: string;
  cityError?: string;
}

export const LocationFields: React.FC<LocationFieldsProps> = ({
  location,
  locationHook,
  customCityValue,
  onCustomCityChange,
  showPhoneInput = true,
  phoneLabel = 'Contact Phone Number *',
  phoneError,
  countryError,
  stateError,
  cityError,
}) => {
  const activeHook = location || locationHook!;
  const {
    countriesList,
    statesList,
    citiesList,
    selectedCountry,
    selectedState,
    selectedCity,
    phoneCode,
    phoneNumber,
    setPhoneNumber,
    loadingCountries,
    loadingStates,
    loadingCities,
    handleCountrySelect,
    handleStateSelect,
    handleCitySelect,
  } = activeHook;

  return (
    <div className="contents space-y-4 md:space-y-0">
      {/* 1. Country Select */}
      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
          Country Location *
        </label>
        <div className="relative group">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 z-20 pointer-events-none flex items-center justify-center w-5 h-5 shrink-0">
            <Globe className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2} />
          </div>
          <select
            value={selectedCountry?.id || ''}
            onChange={(e) => {
              const cId = Number(e.target.value);
              const found = countriesList.find((c) => c.id === cId) || null;
              handleCountrySelect(found);
            }}
            disabled={loadingCountries}
            className="glass-input !pl-11 pr-8 bg-[#091424] cursor-pointer text-sm font-semibold rounded-xl"
          >
            {loadingCountries ? (
              <option value="">Loading countries...</option>
            ) : (
              <>
                <option value="">Select Country</option>
                {countriesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji ? `${c.emoji} ` : ''}{c.name} ({c.phone_code.startsWith('+') ? c.phone_code : `+${c.phone_code}`})
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
        {countryError && <p className="text-[11px] font-semibold text-rose-400 mt-1">{countryError}</p>}
      </div>

      {/* 2. State Select */}
      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
          State / Province / Region
        </label>
        <div className="relative group">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 z-20 pointer-events-none flex items-center justify-center w-5 h-5 shrink-0">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2} />
          </div>
          <select
            value={selectedState?.id || ''}
            onChange={(e) => {
              const sId = Number(e.target.value);
              const found = statesList.find((s) => s.id === sId) || null;
              handleStateSelect(found);
            }}
            disabled={!selectedCountry || loadingStates}
            className="glass-input !pl-11 pr-8 bg-[#091424] cursor-pointer text-sm font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!selectedCountry ? (
              <option value="">Select Country First</option>
            ) : loadingStates ? (
              <option value="">Loading states...</option>
            ) : statesList.length === 0 ? (
              <option value="">No states available</option>
            ) : (
              <>
                <option value="">Select State / Region</option>
                {statesList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
        {stateError && <p className="text-[11px] font-semibold text-rose-400 mt-1">{stateError}</p>}
      </div>

      {/* 3. City Select / Input */}
      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
          City Location *
        </label>
        <div className="relative group">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 z-20 pointer-events-none flex items-center justify-center w-5 h-5 shrink-0">
            <Building2 className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2} />
          </div>
          {citiesList.length > 0 ? (
            <select
              value={selectedCity?.id || ''}
              onChange={(e) => {
                const cId = Number(e.target.value);
                const found = citiesList.find((c) => c.id === cId) || null;
                handleCitySelect(found);
                if (found && onCustomCityChange) {
                  onCustomCityChange(found.name);
                }
              }}
              disabled={!selectedState || loadingCities}
              className="glass-input !pl-11 pr-8 bg-[#091424] cursor-pointer text-sm font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!selectedState ? (
                <option value="">Select State First</option>
              ) : loadingCities ? (
                <option value="">Loading cities...</option>
              ) : (
                <>
                  <option value="">Select City</option>
                  {citiesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          ) : (
            <input
              type="text"
              value={customCityValue !== undefined ? customCityValue : selectedCity?.name || ''}
              onChange={(e) => {
                if (onCustomCityChange) onCustomCityChange(e.target.value);
              }}
              placeholder={!selectedCountry ? 'Select Country First' : 'Enter City Name'}
              disabled={!selectedCountry}
              className="glass-input !pl-11 text-sm font-semibold rounded-xl bg-[#091424] disabled:opacity-50 disabled:cursor-not-allowed"
            />
          )}
        </div>
        {cityError && <p className="text-[11px] font-semibold text-rose-400 mt-1">{cityError}</p>}
      </div>

      {/* 4. Phone Input connected to Country Code */}
      {showPhoneInput && (
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            {phoneLabel}
          </label>
          <div className="relative group flex items-center">
            {/* Phone Icon */}
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-400 z-20 pointer-events-none flex items-center justify-center w-5 h-5 shrink-0">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" strokeWidth={2} />
            </div>

            {/* Dialing Code Badge */}
            <div className="absolute left-10 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-xs z-20 select-none">
              {phoneCode}
            </div>

            {/* Local Phone Input */}
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="e.g. 501234567"
              className="glass-input !pl-28 text-sm font-mono font-semibold rounded-xl bg-[#091424]"
            />
          </div>
          {phoneError && <p className="text-[11px] font-semibold text-rose-400 mt-1">{phoneError}</p>}
        </div>
      )}
    </div>
  );
};
