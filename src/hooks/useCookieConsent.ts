import { useState } from "react";

const COOKIE_NAME = "cookie_consent";
const COOKIE_DAYS = 365;

function getCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

export function useCookieConsent() {
  const [accepted, setAccepted] = useState(() => getCookie(COOKIE_NAME) === "true");

  function accept() {
    setCookie(COOKIE_NAME, "true", COOKIE_DAYS);
    setAccepted(true);
  }

  return { accepted, accept };
}
