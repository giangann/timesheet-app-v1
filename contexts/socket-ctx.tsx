import { MyToast } from "@/ui/MyToast";
import { usePathname, useRouter } from "expo-router";
import { createContext, useEffect, useState } from "react";
import { useSession } from "./ctx";
import { TDutyFormCreateNoti, TLeaveFormCreateNoti, TOvertimeFormCreateNoti } from "@/api/form/types";
import { FORM_NOTI_TYPE } from "@/constants/Misc";

export const SocketContext = createContext<{
  wsClient: WebSocket | null;
}>({
  wsClient: null,
});

type SocketProviderProps = {
  children: React.ReactNode;
};
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  // get token for auth websocket
  const { session } = useSession();
  // define state store websocket client instance
  const [websocketClient, setWebsocketClient] = useState<WebSocket | null>(null);

  // handle if session not initialized
  useEffect(() => {
    // construct websocket client instance
    const wsClient = new WebSocket("wss://proven-incredibly-redbird.ngrok-free.app/ws");

    const onOpen = () => {
      console.log("connection opened");

      const authMessage = { type: "AUTH", token: session };
      wsClient.send(JSON.stringify(authMessage));
    };

    const onClose = (event: WebSocketCloseEvent) => {
      console.log(`WebSocket connection closed, code=${event.code}, reason=${event.reason}, message=${event.message}`);
    };

    const onError = (ev: WebSocketMessageEvent) => {
      console.log("error occured: ", ev);
    };

    const onAuthMessage = (ev: WebSocketMessageEvent) => {
      const evDataParsed = JSON.parse(ev.data);
      const evType = evDataParsed.type;

      if (evType === "AUTH_SUCCESS") {
        console.log("Connection by token now authenticated!");
      }
      if (evType === "AUTH_FAILED") {
        // if (!pathname.match("/auth/login")) {
        // }
        // MyToast.error(`khởi tạo Websocket thất bại: ${evDataParsed.message}`);
      }
    };

    const onNewNotiMessage = (ev: WebSocketMessageEvent) => {
      const evDataParsed: TLeaveFormCreateNoti | TOvertimeFormCreateNoti | TDutyFormCreateNoti | { type: "AUTH_FAILED" | "AUTH_SUCCESS" } =
        JSON.parse(ev.data);
      const evType = evDataParsed.type;

      if (evType !== "AUTH_SUCCESS" && evType !== "AUTH_FAILED") {
        console.log("noti ev", evDataParsed);
        if (evType === FORM_NOTI_TYPE.LEAVE_FORM) {
          const handlePress = () => router.navigate({ pathname: "/approve-forms/leave_forms/[id]", params: { id: evDataParsed.obj.id } });
          MyToast.notify(`${evDataParsed.title} - ${evDataParsed.message} Đơn xin nghỉ`, { onPress: handlePress });
        }
        if (evType === FORM_NOTI_TYPE.OVERTIME_FORM) {
          const handlePress = () => router.navigate({ pathname: "/approve-forms/overtime_forms/[id]", params: { id: evDataParsed.obj.id } });
          MyToast.notify(`${evDataParsed.title} - ${evDataParsed.message} Đơn làm ngoài giờ`, { onPress: handlePress });
        }
        if (evType === FORM_NOTI_TYPE.DUTY_FORM) {
          const handlePress = () => router.navigate({ pathname: "/approve-forms/duty_forms/[id]", params: { id: evDataParsed.obj.id } });
          MyToast.notify(`${evDataParsed.title} - ${evDataParsed.message} Đơn trực`, { onPress: handlePress });
        }
      }
    };

    wsClient.onopen = onOpen;
    wsClient.onclose = onClose;
    wsClient.onerror = onError;

    wsClient.addEventListener("message", onAuthMessage);
    wsClient.addEventListener("message", onNewNotiMessage);

    // update instance provider state
    setWebsocketClient(wsClient);

    return () => {
      wsClient.close();
      wsClient.removeEventListener("open", onOpen);
      wsClient.removeEventListener("close", onClose);
      wsClient.removeEventListener("error", onError);
      wsClient.removeEventListener("message", onAuthMessage);
      wsClient.removeEventListener("message", onNewNotiMessage);
    };
  }, [session]);
  // pass to provider
  return <SocketContext.Provider value={{ wsClient: websocketClient }}>{children}</SocketContext.Provider>;
};

/**
 * AUTH FAILED:
 *
 * Response: JSON.parse(ev.data)
 * {"message": "Invalid token", "type": "AUTH_FAILED"}
 */

/**
 * AUTH SUCCESS:
 *
 * Response: JSON.parse(ev.data)
 * {"type": "AUTH_SUCCESS"}
 */
