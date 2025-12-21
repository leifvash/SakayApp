import React, { createContext, useState, useContext } from 'react';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

type RouteStep = {
  _id: string;
  direction: string;
  district: string;
  name: string;
  route: {
    coordinates: [number, number][];
  };
};


type LocationContextType = {
  origin: Coordinates | null;
  destination: Coordinates | null;
  setOrigin: (location: Coordinates | null) => void;
  setDestination: (location: Coordinates | null) => void;
  recommendedPlan: RouteStep[] | null;
  setRecommendedPlan: (plan: RouteStep[] | null) => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [origin, setOrigin] = useState<Coordinates | null>(null);
  const [destination, setDestination] = useState<Coordinates | null>(null);
  const [recommendedPlan, setRecommendedPlan] = useState<RouteStep[] | null>(null);

  return (
    <LocationContext.Provider
      value={{
        origin,
        destination,
        setOrigin,
        setDestination,
        recommendedPlan,
        setRecommendedPlan,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within a LocationProvider');
  return context;
};