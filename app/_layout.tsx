import { SessionProvider } from "@/contexts/ctx";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { RootSiblingParent } from "react-native-root-siblings";
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://449a5848754654eceaa1424ad7da4636@o4507923809173504.ingest.us.sentry.io/4507928784732160",

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  enableSpotlight: __DEV__,
});

function Root() {
  // Set up the auth context and render our layout inside of it.
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Nunito: require("../assets/fonts/Nunito-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <RootSiblingParent>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <SessionProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="forms" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ headerShown: false }} />
            <Stack.Screen name="approve-forms" options={{ headerShown: false }} />
            <Stack.Screen name="time-keepings" options={{ headerShown: false }} />
            <Stack.Screen name="timesheet" options={{ headerShown: false }} />
          </Stack>
        </SessionProvider>
      </ThemeProvider>
    </RootSiblingParent>
  );
}
export default Sentry.wrap(Root);
