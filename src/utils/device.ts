export function isIOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isInStandaloneMode() {
  //@ts-ignore
  if (window.navigator?.standalone) {
    return true;
  }
  // Para otros dispositivos (p.ej. Android)
  return window.matchMedia("(display-mode: standalone)").matches;
}

export const isPwaInIOS = () => {
  return isIOS() && isInStandaloneMode();
};
