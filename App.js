import React from 'react';
import { LogBox } from "react-native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import ListScreen from "./src/screens/ListScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ScheduleScreen from "./src/screens/ScheduleScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

import firebase from "./api/firebase";
import { colors } from 'react-native-elements';

const Stack = createStackNavigator();

const screens = [
  { name: "Home", component: HomeScreen },
  { name: "Login", component: LoginScreen },
  { name: "Register", component: RegisterScreen },
  { name: "List", component: ListScreen },
  { name: "Schedule", component: ScheduleScreen },
  { name: "Profile", component: ProfileScreen}
];

// unfixable "bug" due to Firebase JS SDK's use of long setTimeout
// for subscribing functions, e.g., firebase.database().Reference.on()
// read more at https://github.com/facebook/react-native/issues/12981
LogBox.ignoreLogs(["Setting a timer for a long period of"]);

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#DEB887",
    accent: "#FFDBAC",
  },
};

export default function App() {
  return (
    <PaperProvider theme = {theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={screens[0].name} headerMode="none" screenOptions={{
        headerStyle: { elevation: 0 },
        cardStyle: { backgroundColor: '#F5DEB3' }
    }}>
          {screens.map(({ name, component }) => <Stack.Screen key={name} name={name} component={component} />)}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}


