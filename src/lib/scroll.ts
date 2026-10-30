export function cleanUrl() {
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
}

export function scrollToId(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  el.focus({ preventScroll: true });
  cleanUrl(); // the address bar stays clean: no #fragments
  return true;
}

export function goToSection(id: string) {
  if (window.location.pathname === "/") scrollToId(id);
  else {
    sessionStorage.setItem("nav-target", id);
    window.location.assign("/");
  }
}
