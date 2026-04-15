import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { RouteProp } from "@react-navigation/native";

export type RootTabParamList = {
  Home: undefined;
  Explore: undefined;
};

export type HomeScreenNavigationProp = BottomTabNavigationProp<
  RootTabParamList,
  "Home"
>;
export type ExploreScreenNavigationProp = BottomTabNavigationProp<
  RootTabParamList,
  "Explore"
>;

export type HomeScreenRouteProp = RouteProp<RootTabParamList, "Home">;
export type ExploreScreenRouteProp = RouteProp<RootTabParamList, "Explore">;
