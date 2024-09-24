import { SocketContext } from "@/contexts/socket-ctx";
import { useContext } from "react";

export const useSocketClient = () => useContext(SocketContext);
