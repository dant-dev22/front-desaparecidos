const PAYPAL_URL =
  "https://www.paypal.com/donate?business=dantedev22%40gmail.com&amount=5&currency_code=USD";

export function DonationSection() {
  return (
    <div className="rounded-2xl border border-wc-gold/40 bg-wc-gold/10 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="text-center sm:text-left">
        <p className="font-stadium text-sm uppercase tracking-wider text-wc-ink">
          ¿Te fue útil?
        </p>
        <p className="text-xs text-wc-ink/60 mt-0.5">
          Agradezco tu apoyo 💚
        </p>
      </div>
      <a
        href={PAYPAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#0070ba] hover:bg-[#005ea6] active:scale-95 transition-all px-5 py-2 text-sm font-semibold text-white"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-4 w-4 fill-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
        </svg>
        Donar con PayPal
      </a>
    </div>
  );
}
