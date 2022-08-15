import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider, View } from "native-base";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-url-polyfill/auto";
import Navigator from "./src/components/routes/navigator";
import UserAuthProvider from "./src/store/auth/provider";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        const cacheImages = [require("./assets/map_marker.png")].map((image) =>
          Asset.fromModule(image).downloadAsync()
        );

        await Promise.all([
          Font.loadAsync(FontAwesome.font),
          Font.loadAsync(FontAwesome5.font),
          ...cacheImages,
        ]);
      } catch (error) {
        console.warn({ error });
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <NativeBaseProvider>
      <SafeAreaProvider>
        <View onLayout={onLayoutRootView} flex={1}>
          <NavigationContainer>
            <StatusBar translucent animated style="auto" />
            <UserAuthProvider>
              <Navigator />
            </UserAuthProvider>
          </NavigationContainer>
        </View>
      </SafeAreaProvider>
    </NativeBaseProvider>
  );
}
