import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

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
    SocketService.instance ??= new SocketService();
    return SocketService.instance;
  }

  async connect(): Promise<void> {
    if (this.connected && this.client?.connected) return;

    const wsUrl = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_WS_PATH}`;
    console.log("Connecting to WebSocket URL:", wsUrl);

    this.client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      debug: (str) => console.log("[STOMP]", str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ STOMP connected");
        this.connected = true;

        // Subscribe to queued destinations
        this.subscriptions.forEach(({ destination, callback }) => {
          const sub = this.client?.subscribe(destination, callback);
          console.log(`✅ Subscribed to ${destination}`);
          if (!sub) console.warn(`❌ Failed to subscribe to ${destination}`);
        });
      },
      onDisconnect: () => {
        console.log("⚠️ STOMP disconnected");
        this.connected = false;
      },
      onStompError: (frame) => {
        console.error("❌ STOMP error:", frame.headers["message"]);
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
