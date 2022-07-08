import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";
import Navigator from "./src/components/routes/navigator";
import UserAuthProvider from "./src/store/auth/provider";

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <StatusBar translucent animated style="auto" />
        <UserAuthProvider>
          <Navigator />
        </UserAuthProvider>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
