import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import Constants from "expo-constants";

import { Platform } from "react-native";

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
  error?: string[];
  status?: string[];
}

export const usePushNotifications = (): PushNotificationState => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldShowAlert: true,
      shouldSetBadge: false,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | undefined>();

  const [notification, setNotification] = useState<Notifications.Notification | undefined>();

  const [error, setError] = useState<string[]>([]);

  const [status, setStatus] = useState<string[]>([]);

  const addStatus = (newStatus: string) => setStatus((prev) => [...prev, newStatus]);
  const addError = (newError: string) => setError((prev) => [...prev, newError]);

  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        addStatus(`Not granted, now status = ${existingStatus}. Start request permission`)
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        addError(`Failed to get push token for push notification, now status = ${finalStatus}`);
        alert("Failed to get push token for push notification");
        return;
      }

      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      });
    } else {
      addError("Must be using a physical device for Push notifications");
      alert("Must be using a physical device for Push notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  useEffect(() => {
    addStatus("useEffect run, prepare get token...");

    registerForPushNotificationsAsync()
      .then((token) => {
        setExpoPushToken(token);
        addStatus(`Received Token Object: TokenObj = ${token}, token = ${token?.data}`);
      })
      .catch((error) => {
        if (error instanceof Error) addError(`${error.name}${error.message}`);
        else addError(`Unknown Error, StringFy = ${JSON.stringify(error)}`);
      });

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      console.log("clean up: remove notifications subcriptions~!");
      Notifications.removeNotificationSubscription(notificationListener.current!);

      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  return {
    expoPushToken,
    notification,
    error,
    status,
  };
};
