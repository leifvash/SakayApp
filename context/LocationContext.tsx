import React, { createContext, useState, useContext } from 'react';

type LocationContextType = {
  origin: string | null;
  destination: string | null;
  setOrigin: (location: string) => void;
  setDestination: (location: string) => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [origin, setOrigin] = useState<string | null>(null);
  const [destination, setDestination] = useState<string | null>(null);

  return (
    <LocationContext.Provider value={{ origin, destination, setOrigin, setDestination }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within a LocationProvider');
  return context;
};
