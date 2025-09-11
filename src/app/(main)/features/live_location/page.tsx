"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import SocketService from "@/lib/hooks/socket-service";

// Fix Leaflet marker icons
const DefaultIcon = L.icon({
  iconUrl:
    "https://thumbs.dreamstime.com/z/live-location-pin-tracking-position-vector-illustration-stock-image-eps-277060574.jpg?ct=jpeg",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LiveLocationDTO {
  userId: number;
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  bearing?: number;
  geofenceStatus?: string;
  source?: string;
  sharingSessionId?: string;
  timestamp?: string;
}

// Auto-pan the map when marker moves
const PanToMarker = ({ position }: { position: LatLngExpression }) => {
  const map = useMap();
  useEffect(() => {
    map.panTo(position);
  }, [position, map]);
  return null;
};

export default function LiveMap() {
  const [coords, setCoords] = useState<LatLngExpression>([27.7172, 85.324]); // initial coords
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    const socket = SocketService.getInstance();

    socket.connect().then(() => {
      console.log("WebSocket connected for LiveLocation");
    });

    // Subscribe to live location topic
    const liveSub = socket.subscribe("/topic/liveLocation", (msg) => {
      try {
        const data: LiveLocationDTO = JSON.parse(msg.body);
        console.log("Received LiveLocationDTO:", data);

        // Update marker
        setCoords([data.latitude, data.longitude]);
      } catch (error) {
        console.error("Failed to parse LiveLocationDTO:", error);
      }
    });

    return () => {
      liveSub?.unsubscribe();
      socket.disconnect();
    };
  }, []);

  return (
    <div className="relative h-[800px] w-full">
      <div className="absolute top-2 left-2 z-10 rounded bg-white p-2 shadow">
        <p className="text-sm font-medium">
          Latitude: {(coords as [number, number])[0].toFixed(6)}, Longitude:{" "}
          {(coords as [number, number])[1].toFixed(6)}
        </p>
      </div>

      <MapContainer center={coords} zoom={15} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={coords} ref={markerRef}>
          <Popup>Live location marker</Popup>
        </Marker>
        <PanToMarker position={coords} />
      </MapContainer>
    </div>
  );
}
