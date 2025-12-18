export type Location = {
  id: string;
  name: string;
};

export type RootStackParamList = {
  MainScreen: undefined;
  AdminLoginScreen: undefined;
  AddRoute: undefined;
  EditRoute: { route: Location };
  RouteList: { isAdmin: boolean };
  MapPicker: { type: 'origin' | 'destination' };
  RecommendedRoute: { plan: any[]; error?: string}; // <-- new screen
};

