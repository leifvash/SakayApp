export type Location = {
  id: string;
  name: string;
};

export type RootStackParamList = {
  Main: { origin?: Location; destination?: Location };
  LocationSearch: { type: 'origin' | 'destination' };
  RouteList: { mode: string };
  RouteMap: { routeId: string };
};
// add other routes here as needed