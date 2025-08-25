import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Cookies from "js-cookie";
import axios from "axios";

interface Subscription {
  destination: string;
  callback: (msg: IMessage) => void;
}

class SocketService {
  private static instance: SocketService | null = null;
  private client: Client | null = null;
  private connected = false;
  private subscriptions: Subscription[] = [];

  private constructor() {}

  static getInstance(): SocketService {
    // ✅ Fixed ESLint: use nullish coalescing assignment
    SocketService.instance ??= new SocketService();
    return SocketService.instance;
  }

  async refreshAccessToken(): Promise<boolean> {
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) {
      console.error("No refresh token available");
      return false;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}auth/refresh`, {
        refreshToken,
      });
      const newAccessToken = response.data.accessToken;
      Cookies.set("accessToken", newAccessToken, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      console.log("New access token set:", newAccessToken);
      return true;
    } catch (error) {
      console.error("Failed to refresh access token:", error);
      return false;
    }
  }

  async connect(): Promise<void> {
    if (this.connected && this.client?.connected) return;

    const token = Cookies.get("accessToken");
    console.log("Connecting with URL:", `${process.env.NEXT_PUBLIC_API_URL}ws`, "Tokens:", {
      accessToken: token,
      refreshToken: Cookies.get("refreshToken"),
    });

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${process.env.NEXT_PUBLIC_API_URL}ws`),
      connectHeaders: {
        Authorization: token ? `Bearer ${token}` : "",
        "X-Refresh-Token": Cookies.get("refreshToken") ?? "",
        "X-Client-Id": "react-client",
      },
      debug: (str) => console.log("[STOMP]", str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ STOMP connected");
        this.connected = true;

        this.subscriptions.forEach(({ destination, callback }) => {
          const sub = this.client?.subscribe(destination, callback);
          console.log(`✅ Subscribed to ${destination}`);
          if (!sub) {
            console.warn(`❌ Failed to subscribe to ${destination}`);
          }
        });
      },
      onDisconnect: () => {
        console.log("⚠️ STOMP disconnected");
        this.connected = false;
      },
      onStompError: async (frame) => {
        console.error("❌ STOMP error:", frame.headers["message"]);
        if (frame.headers["message"]?.includes("Invalid or expired JWT token")) {
          if (await this.refreshAccessToken()) {
            console.log("Retrying connection with new access token");
            await this.connect();
          } else {
            console.error("Failed to reconnect after token refresh");
          }
        }
      },
    });

    this.client.activate();
  }

  subscribe(destination: string, callback: (msg: IMessage) => void): StompSubscription | null {
    if (this.client?.connected) {
      const sub = this.client.subscribe(destination, callback);
      console.log(`✅ Subscribed to ${destination}`);
      return sub;
    } else {
      console.warn(`⚠️ Socket not connected, queuing subscription to ${destination}`);
      this.subscriptions.push({ destination, callback });
      return null;
    }
  }

  disconnect(): void {
    if (this.client?.active) {
      this.client.deactivate();
      this.connected = false;
      this.subscriptions = [];
      console.log("🛑 STOMP disconnected manually");
    }
  }

  // ✅ Fixed ESLint: use generic type instead of `any`
  send<T>(destination: string, body: T) {
    if (!this.client?.connected) {
      console.error("Socket not connected");
      return;
    }
    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });
  }
}

export default SocketService;
