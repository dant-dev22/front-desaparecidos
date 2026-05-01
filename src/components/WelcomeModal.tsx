import { APP_NAME } from "../brand";

interface WelcomeModalProps {
  open: boolean;
  onAccept: () => void;
}

export function WelcomeModal({ open, onAccept }: WelcomeModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-wc-ink/70 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-wc-cream shadow-trophy overflow-hidden animate-pop">
        <div className="bg-wc-hero px-6 py-8 text-white text-center relative">
          <div className="absolute inset-0 opacity-20 field-stripes" aria-hidden="true" />
          <div className="relative">
            <div className="text-6xl animate-bounce-ball" aria-hidden="true">⚽</div>
            <h1
              id="welcome-title"
              className="stadium-title text-3xl sm:text-4xl mt-3 leading-tight"
            >
              {APP_NAME}!
            </h1>
            <p className="mt-3 text-white/90 font-body text-sm sm:text-base">
            48 nations. One trophy. Millions of fans. One opportunity to never go home.
            </p>
          </div>
        </div>

        <div className="px-6 py-6 text-center">
          <p className="text-base sm:text-lg text-wc-ink/90 leading-relaxed">
            Want to know your <strong>chances of making it home safely</strong> from
            the host area?
          </p>
          <p className="mt-2 text-sm text-wc-ink/60">
            We'll compare your profile against Jalisco, Michoacán, and Colima missing-person data.
          </p>

          <button
            type="button"
            onClick={onAccept}
            className="btn-primary w-full mt-6"
            autoFocus
          >
            <span aria-hidden="true">🏆</span>
            Yes, let's check
          </button>

          <p className="mt-3 text-[11px] uppercase tracking-wider text-wc-ink/50">
            Public data · Not affiliated with FIFA
          </p>
        </div>
      </div>
    </div>
  );
}
