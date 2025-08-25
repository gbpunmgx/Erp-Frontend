"use client";
import { useEffect, useState } from "react";
import SocketService from "@/lib/hooks/socket-service";
import Cookies from "js-cookie";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  imageUrl?: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    console.log("Tokens:", {
      accessToken: Cookies.get("accessToken"),
      refreshToken: Cookies.get("refreshToken"),
    });
    const socket = SocketService.getInstance();
    socket.connect().then((r) => {});

    const broadcastSub = socket.subscribe("/topic/notifications", (msg) => {
      console.log("✅ Received message:", msg.body);
      try {
        const data = JSON.parse(msg.body);
        console.log("Parsed data:", data);
        setNotifications((prev) => [data, ...prev]);
      } catch (error) {
        console.error("❌ Failed to parse message:", error);
      }
    });

    if (!broadcastSub) {
      console.warn("❌ Subscription to /topic/notifications failed or queued");
    }

    return () => {
      console.log("Cleaning up subscription");
      broadcastSub?.unsubscribe();
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((n) => (
          <li key={n.id}>
            <b>{n.title}</b>: {n.message} [{n.type}]
          </li>
        ))}
      </ul>
    </div>
  );
}
