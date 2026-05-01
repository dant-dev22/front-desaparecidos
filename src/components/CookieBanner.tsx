interface CookieBannerProps {
  onAccept: () => void;
}

export function CookieBanner({ onAccept }: CookieBannerProps) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-wc-ink text-white px-4 py-4 sm:py-3">
      <div className="mx-auto max-w-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-sm text-white/80 leading-snug">
          Usamos cookies para mejorar tu experiencia en esta aplicación. Al continuar navegando,
          aceptas nuestro uso de cookies conforme a nuestra política de privacidad.
        </p>
        <button
          onClick={onAccept}
          className="shrink-0 rounded-xl bg-wc-green hover:bg-wc-green/80 active:scale-95 transition-all px-5 py-2 text-sm font-semibold text-white"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
