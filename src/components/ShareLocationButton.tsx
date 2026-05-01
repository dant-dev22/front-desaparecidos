import { APP_NAME } from "../brand";

interface ShareLocationButtonProps {
  cityLabel: string;
}

function buildCityMapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function buildWhatsAppUrl(text: string): string {
  // wa.me opens the OS chooser to pick a chat. No phone number = "share with…" on mobile.
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function ShareLocationButton({ cityLabel }: ShareLocationButtonProps) {
  function handleShare() {
    const q = cityLabel.trim();
    if (!q) {
      alert("City name is missing. Run another check with a selected city.");
      return;
    }

    const mapsUrl = buildCityMapsUrl(q);
    const message =
      `🌎 ${APP_NAME} — city check-in\n` +
      `I'm in: ${q}\n` +
      `Map (city area): ${mapsUrl}\n` +
      `(sent from ${APP_NAME})`;

    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  }

  return (
    <button type="button" onClick={handleShare} className="btn-share w-full">
      <span aria-hidden="true">💚</span>
      Share city on WhatsApp
    </button>
  );
}
