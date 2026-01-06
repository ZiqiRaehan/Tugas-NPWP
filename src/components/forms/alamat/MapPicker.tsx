"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default Leaflet markers not showing
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

type MapPickerProps = {
    initialLat?: number;
    initialLng?: number;
    onConfirm: (lat: number, lng: number) => void;
    onClose: () => void;
};

// Component to handle map clicks
function LocationMarker({ position, setPosition }: { position: L.LatLng | null, setPosition: (pos: L.LatLng) => void }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position ? <Marker position={position} /> : null;
}

export default function MapPicker({ initialLat = -6.200000, initialLng = 106.816666, onConfirm, onClose }: MapPickerProps) {
    const [position, setPosition] = useState<L.LatLng | null>(
        initialLat && initialLng ? new L.LatLng(initialLat, initialLng) : null
    );

    const handleConfirm = () => {
        if (position) {
            onConfirm(position.lat, position.lng);
        } else {
            alert("Silakan pilih lokasi pada peta terlebih dahulu.");
        }
    };

    return (
        <div className="picker-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: 1, position: 'relative' }}>
                <MapContainer
                    center={[initialLat || -6.2088, initialLng || 106.8456]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker position={position} setPosition={setPosition} />
                </MapContainer>
            </div>
            <div className="picker-footer" style={{
                padding: '16px',
                background: 'white',
                borderTop: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    {position ? `Terpilih: ${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}` : "Klik pada peta untuk menandai lokasi"}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={onClose} style={{
                        padding: '8px 16px', borderRadius: '6px', border: '1px solid #ccc', background: 'white', cursor: 'pointer'
                    }}>
                        Batal
                    </button>
                    <button onClick={handleConfirm} style={{
                        padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#1B4B38', color: 'white', fontWeight: 600, cursor: 'pointer'
                    }}>
                        Pilih Lokasi
                    </button>
                </div>
            </div>
        </div>
    );
}
