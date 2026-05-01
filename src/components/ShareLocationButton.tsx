import { useState } from "react";

interface ShareLocationButtonProps {
  coords: { lat: number; lon: number } | null;
}

function buildMapsUrl(lat: number, lon: number): string {
  return `https://maps.google.com/?q=${lat.toFixed(6)},${lon.toFixed(6)}`;
}

function buildWhatsAppUrl(text: string): string {
  // wa.me opens the OS chooser to pick a chat. No phone number = "share with…" on mobile.
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function ShareLocationButton({ coords }: ShareLocationButtonProps) {
  const [busy, setBusy] = useState(false);

  async function handleShare() {
    setBusy(true);
    try {
      // Try to refresh to a fresh, real-time fix before sharing.
      const fresh = await new Promise<{ lat: number; lon: number } | null>((resolve) => {
        if (!navigator.geolocation) return resolve(coords);
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
          () => resolve(coords),
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 },
        );
      });

      const finalCoords = fresh ?? coords;
      if (!finalCoords) {
        alert("We couldn't read your location. Please enable GPS and try again.");
        return;
      }

      const mapsUrl = buildMapsUrl(finalCoords.lat, finalCoords.lon);
      const message =
        `🌎 World Cup 2026 — sharing my live location\n` +
        `I'm at: ${mapsUrl}\n` +
        `(sent from Home Run 2026)`;

      window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="btn-share w-full"
      disabled={busy}
    >
      <span aria-hidden="true">💚</span>
      {busy ? "Getting your fix…" : "Share live location on WhatsApp"}
    </button>
  );
}
