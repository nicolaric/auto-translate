declare global {
  interface Window {
    gtag: (
      option: string,
      gaTrackingId: string,
      options: Record<string, unknown>
    ) => void;
  }
}

/**
 * @example
 * https://developers.google.com/analytics/devguides/collection/gtagjs/pages
 */
export function pageview(url: string, trackingId: string) {
  if (!window.gtag) {
    console.warn(
      "window.gtag is not defined. This could mean your google analytics script has not loaded on the page yet."
    );
    return;
  }
  window.gtag("config", trackingId, {
    page_path: url,
  });
}

/**
 * @example
 * https://developers.google.com/analytics/devguides/collection/gtagjs/events
 */
export function event(category: string, body: Record<string, unknown>) {
  if (!window.gtag) {
    console.warn(
      "window.gtag is not defined. This could mean your google analytics script has not loaded on the page yet."
    );
    return;
  }
  window.gtag("event", category, body);
}
